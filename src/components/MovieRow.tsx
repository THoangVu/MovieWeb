import React, { useRef } from "react";
import MovieCard, { type Movie } from "./MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";

type MovieRowProps = {
  title?: string;
  movies: Movie[];
};

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="px-6 mb-10">
      {title && (
        <h2 className="text-white text-2xl font-bold mb-4">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Prev */}
        <button
          ref={prevRef}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition"
        >
          <IoIosArrowBack className="text-white text-xl" />
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={false}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !==
                  "boolean"
              ) {
                swiper.params.navigation.prevEl =
                  prevRef.current;
                swiper.params.navigation.nextEl =
                  nextRef.current;
              }

              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            });
          }}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Next */}
        <button
          ref={nextRef}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition"
        >
          <IoIosArrowForward className="text-white text-xl" />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;