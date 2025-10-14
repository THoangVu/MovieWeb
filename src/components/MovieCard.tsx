import React from "react";

export type Movie = {
  id: string;
  category: string;
  title: string;
  poster: string;
  rating?: number;
};

type MovieCardProps = {
  movie: Movie;
  onClick?: (movie: Movie) => void;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div
      className="group relative w-40 sm:w-48 md:w-56 cursor-pointer"
      onClick={() => onClick?.(movie)}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="h-60 sm:h-72 md:h-80 w-full object-cover rounded shadow-md transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 rounded bg-black/0 group-hover:bg-black/30 transition-colors" />
      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
        {movie.rating !== undefined && (
          <p className="text-xs text-gray-200">⭐ {movie.rating.toFixed(1)}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;


