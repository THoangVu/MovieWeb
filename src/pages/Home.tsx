import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import MovieRow from "../components/MovieRow";
import { Flame, TrendingUp, Star } from "lucide-react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
}

const Home: React.FC = () => {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [trendingType, setTrendingType] = useState("day");
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = "https://api.themoviedb.org/3";

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const options = {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        const [popularRes, topRatedRes, upcomingRes] = await Promise.all([
          fetch(`${API_URL}/movie/popular?language=vi&page=1`, options),
          fetch(`${API_URL}/movie/top_rated?language=vi&page=1`, options),
          fetch(`${API_URL}/movie/upcoming?language=vi&page=1`, options),
        ]);

        const [popularData, topRatedData, upcomingData] = await Promise.all([
          popularRes.json(),
          topRatedRes.json(),
          upcomingRes.json(),
        ]);

        setPopular(popularData.results || []);
        setTopRated(topRatedData.results || []);
        setUpcoming(upcomingData.results || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Fetch trending
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `${API_URL}/trending/all/${trendingType}?language=vi`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setTrending(data.results?.filter((item: { media_type: string }) => item.media_type !== "person") || []);
      } catch (error) {
        console.error("Error fetching trending:", error);
      }
    };

    fetchTrending();
  }, [trendingType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-red-950 pb-20">
      {/* Banner */}
      <Banner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trending Section */}
        <section className="mt-16 mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame className="text-orange-400" size={32} />
              <h2 className="text-4xl font-black text-white">Trending Now</h2>
            </div>
            <div className="flex gap-2">
              {(["day", "week"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTrendingType(type)}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    trendingType === type
                      ? "bg-orange-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {type === "day" ? "Today" : "This Week"}
                </button>
              ))}
            </div>
          </div>
          <MovieRow movies={trending} />
        </section>

        {/* Popular Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-cyan-400" size={32} />
            <h2 className="text-4xl font-black text-white">Popular</h2>
          </div>
          <MovieRow movies={popular} />
        </section>

        {/* Top Rated Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Star className="text-yellow-400" size={32} />
            <h2 className="text-4xl font-black text-white">Top Rated</h2>
          </div>
          <MovieRow movies={topRated} />
        </section>

        {/* Upcoming Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⏰</span>
            </div>
            <h2 className="text-4xl font-black text-white">Coming Soon</h2>
          </div>
          <MovieRow movies={upcoming} />
        </section>

        {/* Info Section */}
        
      </div>
    </div>
  );
};

export default Home;