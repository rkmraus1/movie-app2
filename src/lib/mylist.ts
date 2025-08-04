import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import type { MovieDetail } from "../types/media"; 

//マイリストに追加
export const addToMyList = async (uid: string, movie: MovieDetail) => {
  await setDoc(
    doc(db, "users", uid, "mylist", String(movie.id)),
    {
      id: movie.id,
      original_title: movie.original_title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      created_at: new Date(),
    }
  );
};

//マイリストから削除
export const removeFromMyList = async (uid: string, movieId: string) => {
  await deleteDoc(doc(db, "users", uid, "mylist", movieId));
};

