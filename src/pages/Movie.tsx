import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Calendar, Filter, ChevronDown } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

const Movie: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = "https://api.themoviedb.org/3";

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${API_URL}/genre/movie/list?language=vi`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/discover/movie?language=vi&page=${page}&sort_by=${sortBy}`;

        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }

        if (searchQuery) {
          url = `${API_URL}/search/movie?query=${searchQuery}&language=vi&page=${page}`;
        }

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, selectedGenre, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-red-950 pt-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-2">Explore Movies</h1>
          <p className="text-slate-400">Find your next favorite film</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Genre Filter */}
          <div className="relative flex-1">
            <Filter size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <select
              value={selectedGenre || ""}
              onChange={(e) => {
                setSelectedGenre(e.target.value ? Number(e.target.value) : null);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition appearance-none cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
          </div>

          {/* Sort Filter */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full pl-4 pr-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition appearance-none cursor-pointer"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="rating.desc">Highest Rated</option>
              <option value="release_date.desc">Newest</option>
              <option value="revenue.desc">Highest Grossing</option>
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl">No movies found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden mb-3 border border-cyan-500/10 hover:border-cyan-500/50 transition h-[280px]">
                    {movie.poster_path ? (
                      <>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-4">
                          <Star className="text-yellow-400 mb-2" size={32} />
                          <p className="text-white font-bold">{movie.vote_average.toFixed(1)}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold line-clamp-2 group-hover:text-cyan-400 transition">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                    <Calendar size={14} />
                    <span>{movie.release_date?.slice(0, 4)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 py-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold"
              >
                Previous
              </button>
              <span className="text-white text-lg font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition font-semibold"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Movie;


