// ModalDetail.tsx

import React from "react";
import { type Movie } from "./MovieCard";

type ModalDetailProps = {
  open: boolean;
  movie?: Movie | null;
  onClose: () => void;
};

const ModalDetail: React.FC<ModalDetailProps> = ({
  open,
  movie,
  onClose,
}) => {
  if (!open || !movie) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl">

        {/* Banner */}
        <div
          className="relative h-[400px] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${
              movie.backdrop_path || movie.poster_path
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-black/40 to-transparent" />

          {/* Close */}
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Content */}
          <div className="absolute bottom-8 left-8">
            <h2 className="text-4xl font-bold text-white">
              {movie.title || movie.name}
            </h2>

            <div className="mt-3 flex items-center gap-4 text-sm text-white">
              <span className="font-semibold text-green-400">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>

              <span>
                {movie.release_date || movie.first_air_date}
              </span>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="rounded bg-white px-6 py-2 font-semibold text-black hover:bg-white/90">
                ▶ Play
              </button>

              <button className="rounded bg-white/20 px-6 py-2 font-semibold text-white hover:bg-white/30">
                + My List
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-8">
          <h3 className="mb-3 text-xl font-bold text-white">
            Overview
          </h3>

          <p className="leading-7 text-gray-300">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;