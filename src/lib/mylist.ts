import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import type { MovieDetail, Anime } from "../types/media"; 

//マイリストに追加
export const addToMyList = async (uid: string, media: MovieDetail | Anime, type: "movie" | "anime") => {
  await setDoc(
    doc(db, "users", uid, "mylist", String(media.id)),
    {
      id: media.id,
      original_title: media.original_title,
      overview: media.overview,
      poster_path: media.poster_path,
      release_date: "release_date" in media ? media.release_date : "",
      created_at: new Date(),
      type,
    }
  );
};

//マイリストから削除
export const removeFromMyList = async (uid: string, mediaId: string | number) => {
  await deleteDoc(doc(db, "users", uid, "mylist", String(mediaId))); 
};

