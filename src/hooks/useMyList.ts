import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Movie, Anime } from "../types/media";

// 共用型を定義
type MediaItem = (Movie | Anime) & {
  created_at: Date;
  type: 'movie' | 'anime';
};

export const useMyList = (userId: string | null) => {
  const [myList, setMyList] = useState<MediaItem[]>([]);

  const fetchMyList = async () => {
    if (!userId) {
      setMyList([]);
      return [];
    }

    const myListRef = collection(db, "users", userId, "mylist");
    const snapshot = await getDocs(myListRef);
    
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      // 共通プロパティ
      const baseItem = {
        id: data.id,
        poster_path: data.poster_path,
        overview: data.overview,
        created_at: data.created_at?.toDate?.() ?? new Date(),
        type: data.type || 'movie' // デフォルトはmovie
      };

      // アニメ判定
      if (data.type === 'anime' || data.original_name) {
        return {
          ...baseItem,
          original_name: data.original_name,
          first_air_date: data.first_air_date,
          type: 'anime' as const
        };
      }
      
      // 映画判定
      return {
        ...baseItem,
        original_title: data.original_title,
        release_date: data.release_date,
        type: 'movie' as const
      };
    }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    setMyList(list);
    return list;
  };

  useEffect(() => {
    fetchMyList();
  }, [userId]);

  return {
    myList,
    refresh: fetchMyList,
  };
};