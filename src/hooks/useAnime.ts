// src/hooks/useAnime.ts
import { useEffect, useState } from "react";
import type { Anime, MovieJson } from "../types/media";

// 除外するジャンルID（子供向けやバラエティなど）
const excludedGenres = [10751, 10762, 10770, 10766, 99, 10767, 35];

export const useAnime = (keyword: string) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchAnimeList, setSearchAnimeList] = useState<Anime[]>([]);

  // アニメ一覧（人気順）を取得（初期表示向け）
  const fetchAnimeList = async () => {
    const allResults: MovieJson[] = [];

    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?with_genres=16&sort_by=popularity.desc&language=ja&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      allResults.push(...data.results);
    }

    const filteredResults = allResults.filter((anime: MovieJson) =>
      anime.genre_ids
        ? !anime.genre_ids.some((id) => excludedGenres.includes(id)) &&
          anime.original_language === "ja"
        : false
    );

    const top20 = filteredResults.slice(0, 20);

    setAnimeList(
      top20.map((anime: MovieJson) => ({
        id: anime.id,
        original_title: anime.original_title || anime.name,
        poster_path: anime.poster_path,
        release_date: anime.release_date || "",
        year: Number((anime.release_date || "").split("-")[0]) || 0,
        rating: anime.vote_average,
        runtime: 0,
        score: anime.vote_count,
        genres: [],
        overview: anime.overview || "",
      }))
    );
  };

  // アニメ検索結果の取得（検索時用）
  const fetchAnimeSearchResults = async (keyword: string) => {
    if (!keyword) {
      setSearchAnimeList([]);
      return;
    }

    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(keyword)}&language=ja&page=1`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    });
    const data = await response.json();

    const filteredResults = data.results.filter((anime: MovieJson) =>
      anime.genre_ids?.includes(16)
    );

    setSearchAnimeList(
      filteredResults.map((anime: MovieJson) => ({
        id: anime.id,
        original_title: anime.original_title || anime.name,
        poster_path: anime.poster_path,
        release_date: anime.release_date || "",
        year: Number((anime.release_date || "").split("-")[0]) || 0,
        rating: anime.vote_average,
        runtime: 0,
        score: anime.vote_count,
        genres: [],
        overview: anime.overview || "",
      }))
    );
  };

  // 初期表示アニメ一覧の取得
  useEffect(() => {
    fetchAnimeList();
  }, []);

  // キーワード変更時の検索
  useEffect(() => {
    fetchAnimeSearchResults(keyword);
  }, [keyword]);

  const displayedAnimeList = keyword ? searchAnimeList : animeList;

  return { animeList: displayedAnimeList };
};
