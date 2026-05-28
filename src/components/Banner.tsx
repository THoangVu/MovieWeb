import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Play, Info, Heart } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {   FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface BannerMovie {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
}

const Banner: React.FC = () => {
  const [movies, setMovies] = useState<BannerMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Load favorites
    const saved = localStorage.getItem("mylist");
    if (saved) {
      const items = JSON.parse(saved);
      setFavorites(items.map((item: { id: number }) => item.id));
    }

    // Fetch featured movies
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setMovies(data.results?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching banner movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleFavorite = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const saved = localStorage.getItem("mylist") || "[]";
    let items = JSON.parse(saved);

    const isAlreadyFavorite = favorites.includes(movieId);
    
    if (isAlreadyFavorite) {
      items = items.filter((item: { id: number }) => item.id !== movieId);
      setFavorites(favorites.filter(id => id !== movieId));
    } else {
      const movie = movies.find(m => m.id === movieId);
      if (movie) {
        items.push({
          id: movieId,
          title: movie.title,
          poster_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          addedDate: Date.now(),
          type: "movie",
        });
        setFavorites([...favorites, movieId]);
      }
    }

    localStorage.setItem("mylist", JSON.stringify(items));
  };

  if (loading) {
    return (
      <header className="relative h-[100vh] w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading featured movies...</p>
        </div>
      </header>
    );
  }

  return (
    <header className="relative h-[100vh] w-full text-white overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="relative h-[100vh] bg-cover bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            >
              {/* Overlay gradients */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
                <div className="max-w-3xl">
                  {/* Title */}
                  <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight drop-shadow-lg">
                    {movie.title}
                  </h1>

                  {/* Info Bar */}
                  <div className="flex items-center gap-6 mb-6 text-lg">
                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur px-3 py-1 rounded-lg">
                      <span className="text-yellow-400 font-bold"><FaStar /></span>
                      <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-300">{movie.release_date?.slice(0, 4)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-slate-200 leading-relaxed line-clamp-3 mb-8">
                    {movie.overview}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-4 flex-wrap">
                    <button className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-slate-100 text-black font-bold rounded-lg transition transform hover:scale-105">
                      <Play size={20} fill="currentColor" />
                      Watch Now
                    </button>

                    <button className="flex items-center gap-2 px-8 py-3 bg-slate-800/70 hover:bg-slate-700 border border-white/20 text-white font-bold rounded-lg transition backdrop-blur">
                      <Info size={20} />
                      More Info
                    </button>

                    <button
                      onClick={(e) => handleFavorite(movie.id, e)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition backdrop-blur ${
                        favorites.includes(movie.id)
                          ? "bg-red-500/70 border border-red-400 text-white"
                          : "bg-slate-800/70 border border-white/20 text-white hover:bg-slate-700"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={favorites.includes(movie.id) ? "currentColor" : "none"}
                      />
                      {favorites.includes(movie.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Image overlay indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className="swiper-button-prev after:content-none absolute top-1/2 z-20 !w-12 !h-12 !bg-white/20 hover:!bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition">
        <IoIosArrowBack className="text-white" />
      </button>
      <button className="swiper-button-next after:content-none absolute  top-1/2 z-20 !w-12 !h-12 !bg-white/20 hover:!bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition">
        <IoIosArrowForward className="text-white" />
      </button>
    </header>
  );
};

export default Banner;