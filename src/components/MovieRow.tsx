import React from "react";
import MovieCard, { type Movie } from "./MovieCard";

type MovieRowProps = {
  title: string;
  movies: Movie[];
  onSelect?: (movie: Movie) => void;
};

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onSelect }) => {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <h3 className="text-white text-xl md:text-2xl font-semibold mb-3 px-6">{title}</h3>
      <div className="group/row relative">
        {/* Left button */}
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-600)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-32 w-10 items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-r opacity-0 group-hover/row:opacity-100 transition"
        >
          ‹
        </button>

        {/* Scroll area */}
        <div
          ref={scrollRef}
          className="no-scrollbar overflow-x-auto overflow-y-visible px-6"
        >
          <div className="flex gap-3">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} onClick={onSelect} />
            ))}
          </div>
        </div>

        {/* Right button */}
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(600)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-32 w-10 items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-l opacity-0 group-hover/row:opacity-100 transition"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default MovieRow;


