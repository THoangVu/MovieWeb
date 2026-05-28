import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
};

type MovieCardProps = {
  movie: Movie;
};

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(() => {
    const saved = localStorage.getItem("mylist");
    if (saved) {
      const items = JSON.parse(saved);
      return items.some((item: { id: number }) => item.id === movie.id);
    }
    return false;
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const saved = localStorage.getItem("mylist") || "[]";
    let items = JSON.parse(saved);

    if (isFavorite) {
      items = items.filter((item: { id: number }) => item.id !== movie.id);
    } else {
      items.push({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        release_date: movie.release_date || movie.first_air_date || "",
        vote_average: movie.vote_average || 0,
        addedDate: Date.now(),
        type: movie.media_type || "movie",
      });
    }

    localStorage.setItem("mylist", JSON.stringify(items));
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="cursor-pointer group relative"
    >
      <div className="overflow-hidden rounded-xl relative h-[300px]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleFavoriteClick}
            className={`p-3 rounded-full transition ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/20 text-white hover:bg-white/40"
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Rating badge */}
        {movie.vote_average && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded-lg">
            <p className="text-yellow-400 text-sm font-bold">
              ⭐ {movie.vote_average.toFixed(1)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-cyan-400 transition">
          {movie.title || movie.name}
        </h3>

        <p className="text-slate-400 text-xs mt-1">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : movie.first_air_date
            ? new Date(movie.first_air_date).getFullYear()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;