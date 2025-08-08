import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../styles/App.css";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MovieSection from "../components/MovieSection";
import { useMovies } from "../hooks/useMovies";
import { useAnime } from "../hooks/useAnime";
import { useMyList } from "../hooks/useMyList";
import AnimeSection from "../components/AnimeSection";
import MyListSection from "../components/MyListSection";
import LoginSection from "../components/LoginSection";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";


function App() {
  const [user, setUser] = useState<any>(null);
  const [movieKeyword, setMovieKeyword] = useState("");
  const [animeKeyword, setAnimeKeyword] = useState("");
  const { movieList, heroMovie } = useMovies(movieKeyword);
  const { animeList } = useAnime(animeKeyword); 
  const { myList } = useMyList(user?.uid ?? null); 
  

  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user); // ユーザー情報を更新
  } catch (error) {
    console.error("ログインエラー:", error);
  }
};

  //ログイン情報の受け取り
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);



  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <Header user={user} setUser={setUser}/>

      <HeroSection heroMovie={heroMovie} />

      <div id="movie" className="scroll-mt-14 mt-8 sm:mt-12">
        <MovieSection
          keyword={movieKeyword}
          setKeyword={setMovieKeyword}
          movieList={movieList}
            user={user}
        />
      </div>

      <div id="anime" className="scroll-mt-14 mt-8 sm:mt-12">
        <AnimeSection
        keyword={animeKeyword}
        setKeyword={setAnimeKeyword}
        animeList={animeList}
      />
      </div>

      <div id="mylist" className="scroll-mt-14 mt-8 sm:mt-12 mb-10">
        <MyListSection
        myList={user ? myList : []}
        user={user}
        handleLogin={handleLogin}
         />
      </div>

      <div id="login" className="scroll-mt-14 mt-8 sm:mt-12 mb-10">
        <LoginSection user={user} setUser={setUser} />

      </div>
    </div>
    
  );

}

export default App;