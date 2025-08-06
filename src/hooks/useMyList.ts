import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Movie } from "../types/media";

export const useMyList = (userId: string | null) => {
  const [myList, setMyList] = useState<Movie[]>([]);

  const fetchMyList = async () => {
    if (!userId) {
      setMyList([]);
      return;
    }

    const myListRef = collection(db, "users", userId, "mylist");
    const snapshot = await getDocs(myListRef);
    const list: Movie[] = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          original_title: data.original_title,
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          created_at: data.created_at?.toDate?.() ?? new Date(),
          type: data.type || "movie",
        };
      })
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    setMyList(list);
  };

  // ✅ useEffect 内では上の fetchMyList を使う
  useEffect(() => {
    fetchMyList();
  }, [userId]);

  // ✅ ここで fetchMyList を return に含めて refresh として外部に提供
  return {
    myList,
    refresh: fetchMyList,
  };
};
