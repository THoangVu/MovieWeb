import React from "react";
import { type Movie } from "./MovieCard";

type ModalDetailProps = {
  open: boolean;
  movie?: Movie | null;
  onClose: () => void;
};

const ModalDetail: React.FC<ModalDetailProps> = ({ open, movie, onClose }) => {
  if (!open || !movie) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl bg-neutral-900 rounded overflow-hidden shadow-xl">
        <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster})` }}>
          <button
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5 text-white">
          <h4 className="text-xl font-bold">{movie.title}</h4>
          {movie.rating !== undefined && (
            <p className="mt-1 text-sm text-gray-300">Rating: ⭐ {movie.rating.toFixed(1)}</p>
          )}
          <p className="mt-3 text-sm text-gray-300">
            This is a placeholder description for the selected title. Replace with
            real data from your API when integrating.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded bg-white text-black font-semibold">▶ Play</button>
            <button className="px-4 py-2 rounded bg-white/20 text-white font-semibold">+ My List</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetail;

