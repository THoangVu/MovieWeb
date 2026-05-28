// DetailMovie.tsx

import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  Bookmark,
  Play,
  List,
  X,
} from "lucide-react";

interface MovieDetail {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  overview: string;
  production_companies: Array<{ name: string; id: number }>;
  status: string;
  original_language: string;
  budget: number;
  revenue: number;
  genres: Array<{ id: number; name: string }>;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  popularity: number;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

const DetailMovie: React.FC = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      };

      // Movie detail
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=vi`,
        options
      );

      const movieData = await movieRes.json();

      setMovie(movieData);

      // Check if favorite
      const saved = localStorage.getItem("mylist");
      if (saved) {
        const items = JSON.parse(saved);
        setIsFavorite(items.some((item: { id: number }) => item.id === movieData.id));
      }

      // Videos/Trailers
      const videosRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en`,
        options
      );

      const videosData = await videosRes.json();
      setVideos(videosData.results || []);
      
      // Set default trailer as selected
      const trailer = videosData.results?.find(
        (v: Video) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setSelectedVideo(trailer);
      }

      // Cast
      const castRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=vi`,
        options
      );

      const castData = await castRes.json();

      setCasts(castData.cast.slice(0, 10));

      // Similar
      const similarRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?language=vi&page=1`,
        options
      );

      const similarData = await similarRes.json();

      setSimilar(similarData.results);
    };

    fetchData();
  }, [id]);

  const handleFavorite = () => {
    if (!movie) return;
    
    const saved = localStorage.getItem("mylist") || "[]";
    let items = JSON.parse(saved);

    if (isFavorite) {
      items = items.filter((item: { id: number }) => item.id !== movie.id);
    } else {
      items.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedDate: Date.now(),
        type: "movie",
      });
    }

    localStorage.setItem("mylist", JSON.stringify(items));
    setIsFavorite(!isFavorite);
  };

  if (!movie) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen flex items-center justify-center text-white text-2xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const trailerVideo = videos.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className=" from-slate-900 via-slate-800 to-slate-900 min-h-screen">

      {/* Trailer Modal */}
      {showTrailer && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
          <div className="relative w-full max-w-4xl mx-auto px-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition"
            >
              <X size={28} />
            </button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                title={selectedVideo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              ></iframe>
            </div>
            {videos.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                      selectedVideo.id === video.id
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {video.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <div
        className="relative h-[85vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-center">

          {/* Poster */}
          <div className="hidden lg:block w-[300px] shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl shadow-2xl border-2 border-cyan-500/30"
            />
          </div>

          {/* Info */}
          <div className="lg:ml-10 max-w-3xl text-white">

            <h1 className="text-5xl font-extrabold">
              {movie.title}
            </h1>

            <div className="flex gap-4 mt-4 text-sm text-gray-300">
              <span className="text-yellow-400 font-bold">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>

              <span>{movie.release_date}</span>

              <span>{movie.runtime} phút</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8 flex-wrap">

              {trailerVideo && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 transition rounded-lg font-bold text-white transform hover:scale-105"
                >
                  <Play size={22} fill="currentColor" />
                  Play Trailer
                </button>
              )}

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                  isFavorite
                    ? "bg-red-500/20 border border-red-400 text-red-400 hover:bg-red-500/30"
                    : "bg-white/20 border border-white/30 text-white hover:bg-white/30"
                }`}
              >
                <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Saved" : "Save"}
              </button>

              <button className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 transition rounded-lg font-bold text-white backdrop-blur border border-white/20">
                <Bookmark size={22} />
                Watchlist
              </button>

              <button className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 transition rounded-lg font-bold text-white backdrop-blur border border-white/20">
                <List size={22} />
                Lists
              </button>
            </div>

            {/* Overview */}
            <div className="mt-10">

              <h2 className="text-3xl font-bold">
                Overview
              </h2>

              <p className="mt-4 text-lg leading-8 text-gray-300">
                {movie.overview}
              </p>
            </div>

            {/* Company */}
            <div className="mt-10">
              <h3 className="text-xl font-bold">
                {movie.production_companies?.[0]?.name}
              </h3>

              <p className="text-gray-400">
                Production Company
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-3">

          {/* CAST */}
          <h2 className="text-4xl font-bold mb-8">
            Series Cast
          </h2>

          <div className="flex gap-5 overflow-x-auto pb-5">

            {casts.map((cast) => (
              <div
                key={cast.id}
                onClick={() =>
                  navigate(`/person/${cast.id}`)
                }
                className="min-w-[180px] bg-white rounded-xl overflow-hidden shadow hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={
                    cast.profile_path
                      ? `https://image.tmdb.org/t/p/w300${cast.profile_path}`
                      : "https://via.placeholder.com/300x450"
                  }
                  alt={cast.name}
                  className="w-full h-[240px] object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg">
                    {cast.name}
                  </h3>

                  <p className="text-gray-700">
                    {cast.character}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Popularity: {cast.popularity?.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Similar */}
          <div className="mt-16">
            <h2 className="text-4xl font-bold mb-8">
              Similar Movies
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

              {similar.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    navigate(`/movie/${item.id}`)
                  }
                  className="bg-white rounded-xl overflow-hidden shadow hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-[300px] object-cover"
                  />

                  <div className="p-3">
                    <h3 className="font-bold line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                      ⭐ {item.vote_average?.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>

          <div className="sticky top-28">

            <h3 className="text-2xl font-bold mb-6">
              Facts
            </h3>

            <div className="space-y-6 text-white">

              <div>
                <h4 className="font-bold text-lg">
                  Status
                </h4>

                <p className="text-gray-700">
                  {movie.status}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg">
                  Original Language
                </h4>

                <p className="text-gray-700 uppercase">
                  {movie.original_language}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg">
                  Budget
                </h4>

                <p className="text-gray-700">
                  ${movie.budget?.toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg">
                  Revenue
                </h4>

                <p className="text-gray-700">
                  ${movie.revenue?.toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg">
                  Genres
                </h4>

                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.genres?.map((genre: Genre) => (
                    <span
                      key={genre.id}
                      className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMovie;
