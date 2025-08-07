import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

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
    console.log("映画をマイリストに追加しました");
  } catch (error) {
    console.error("映画の追加に失敗しました", error);
  }
}

// 取得関数
export async function getMyList(userId: string): Promise<Movie[]> {
  try {
    const userCollectionRef = collection(db, "users", userId, "mylist");
    const snapshot = await getDocs(userCollectionRef);
    return snapshot.docs.map(doc => doc.data() as Movie);
  } catch (error) {
    console.error("マイリストの取得に失敗しました", error);
    return [];
  }
}
