// /現在のマイリストの状態を保持・同期
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Movie } from "../types/media";

export const useMyList = (userId: string | null) => {
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMyList = async () => {
      if (!userId) {
        setMyList([]);// ログアウト時は空に
        return;
      }

      const myListRef = collection(db, "users", userId, "mylist");
      const snapshot = await getDocs(myListRef);
      const list: Movie[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          original_title: data.original_title,
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          created_at: data.created_at?.toDate?.() ?? new Date(), // ← FirestoreのTimestamp対応
          type: data.type || "movie", // type含まれていれば使いデフォルトでmovie
        };
      })
       .sort((a, b) => b.created_at.getTime() - a.created_at.getTime()); // ← 新しい順

      setMyList(list);
    };

    fetchMyList();
  }, [userId]);

  return { myList };
};
