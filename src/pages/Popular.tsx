import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Star, Calendar, TrendingUp } from "lucide-react";

interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: "movie" | "tv" | "person";
  popularity: number;
}

const Popular: React.FC = () => {
  const navigate = useNavigate();
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<TrendingItem[]>([]);
  const [popularShows, setPopularShows] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"trending" | "movies" | "shows">("trending");

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);

        // Fetch trending
        const trendingRes = await fetch(
          `${API_URL}/trending/all/week?language=vi`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const trendingData = await trendingRes.json();
        setTrendingItems(trendingData.results?.filter((item: TrendingItem) => item.media_type !== "person") || []);

        // Fetch popular movies
        const moviesRes = await fetch(
          `${API_URL}/movie/popular?language=vi&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const moviesData = await moviesRes.json();
        setPopularMovies(moviesData.results?.map((item: TrendingItem) => ({ ...item, media_type: "movie" })) || []);

        // Fetch popular TV shows
        const showsRes = await fetch(
          `${API_URL}/tv/popular?language=vi&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const showsData = await showsRes.json();
        setPopularShows(showsData.results?.map((item: TrendingItem) => ({ ...item, media_type: "tv" })) || []);
      } catch (error) {
        console.error("Error fetching popular content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const handleItemClick = (item: TrendingItem) => {
    if (item.media_type === "movie") {
      navigate(`/movie/${item.id}`);
    } else if (item.media_type === "tv") {
      navigate(`/tv/${item.id}`);
    }
  };

  const getDisplayData = () => {
    switch (activeTab) {
      case "movies":
        return popularMovies;
      case "shows":
        return popularShows;
      default:
        return trendingItems;
    }
  };

  const displayData = getDisplayData();
  const displayTitle = activeTab === "trending" ? "Trending" : activeTab === "movies" ? "Popular Movies" : "Popular TV Shows";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-red-950 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-orange-400" size={36} />
          <h1 className="text-5xl font-black text-white">What's Hot</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 flex-wrap">
          {(["trending", "movies", "shows"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab === "trending" ? " Trending" : tab === "movies" ? " Movies" : " TV Shows"}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section - Large item */}
      {displayData.length > 0 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div
            onClick={() => handleItemClick(displayData[0])}
            className="relative rounded-2xl overflow-hidden h-96 cursor-pointer group border border-orange-500/20 hover:border-orange-500/50 transition"
          >
            <img
              src={
                displayData[0].backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${displayData[0].backdrop_path}`
                  : `https://image.tmdb.org/t/p/w500${displayData[0].poster_path}`
              }
              alt={displayData[0].title || displayData[0].name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 text-orange-400 mb-3">
                <Flame size={20} />
                <span className="font-bold">Featured</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-2">
                {displayData[0].title || displayData[0].name}
              </h2>
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  <span className="font-bold">{displayData[0].vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>{(displayData[0].release_date || displayData[0].first_air_date)?.slice(0, 4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h3 className="text-3xl font-bold text-white mb-8">{displayTitle}</h3>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl">No content available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayData.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleItemClick(item)}
                className="group cursor-pointer relative"
              >
                <div className="relative rounded-xl overflow-hidden mb-3 border border-orange-500/10 hover:border-orange-500/50 transition h-[220px]">
                  {item.poster_path ? (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 text-center">
                        <Flame className="text-orange-400 mb-1" size={24} />
                        <p className="text-white font-bold text-sm">
                          {item.popularity.toFixed(0)} 🔥
                        </p>
                      </div>
                      {/* Ranking badge */}
                      <div className="absolute top-2 right-2 bg-orange-500 text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center">
                        #{index + 1}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <span className="text-slate-400">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-orange-400 transition">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center justify-between text-slate-400 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    {item.vote_average.toFixed(1)}
                  </span>
                  <span>{item.media_type === "movie" ? "Movie" : "TV"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;


