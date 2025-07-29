import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// 映画データの型（必要に応じて調整）
type Movie = {
  id: string;
  original_title: string;
  poster_path: string;
  overview: string;
  release_date: string;
};

// user.uid を使ってユーザーごとのコレクションに保存する
export async function addMovieToMyList(userId: string, movie: Movie) {
  try {
    const userCollectionRef = collection(db, "users", userId, "mylist");
    await addDoc(userCollectionRef, movie);
    console.log("🎉 映画をマイリストに追加しました");
  } catch (error) {
    console.error("🔥 映画の追加に失敗しました", error);
  }
}
