import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Heart, Clock } from "lucide-react";

interface SavedItem {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  addedDate: number;
  type: "movie" | "tv";
}

const Mylist: React.FC = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  useEffect(() => {
    // Load from localStorage
    setTimeout(() => {
      const stored = localStorage.getItem("mylist");
      if (stored) {
        const items = JSON.parse(stored);
        setSavedItems(items.sort((a: SavedItem, b: SavedItem) => b.addedDate - a.addedDate));
      }
      setLoading(false);
    }, 500);
  }, []);

  const filteredItems = filter === "all" 
    ? savedItems 
    : savedItems.filter(item => item.type === filter);

  const removeItem = (id: number) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem("mylist", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire list?")) {
      setSavedItems([]);
      localStorage.removeItem("mylist");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-red-950 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" size={32} />
            <h1 className="text-5xl font-black text-white">My List</h1>
          </div>
          {savedItems.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters */}
        {savedItems.length > 0 && (
          <div className="flex gap-3 mb-8">
            {(["all", "movie", "tv"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  filter === type
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {type === "all" ? "All" : type === "movie" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="text-slate-400 text-lg">
          {loading ? (
            <span>Loading your list...</span>
          ) : (
            <span>
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} in your list
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-2xl">
            <Heart className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-slate-400 text-xl mb-2">Your list is empty</p>
            <p className="text-slate-500 mb-6">
              {filter === "all"
                ? "Add movies or TV shows to your list by clicking the heart icon"
                : filter === "movie"
                ? "No movies in your list yet"
                : "No TV shows in your list yet"}
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-semibold"
            >
              Explore Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition group"
              >
                {/* Index */}
                <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-lg text-cyan-400 font-bold">
                  {index + 1}
                </div>

                {/* Poster */}
                <div className="relative rounded-lg overflow-hidden w-16 h-24 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/${item.type === "tv" ? "person" : "movie"}/${item.id}`)}>
                  {item.poster_path ? (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                        <div className="text-yellow-400 font-bold text-sm">⭐ {item.vote_average.toFixed(1)}</div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <span className="text-slate-400 text-xs">N/A</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 
                    onClick={() => navigate(`/${item.type === "tv" ? "person" : "movie"}/${item.id}`)}
                    className="text-white font-semibold text-lg group-hover:text-cyan-400 transition cursor-pointer truncate"
                  >
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{item.type === "movie" ? "Movie" : "TV Show"}</p>
                  <div className="flex items-center gap-4 text-slate-400 text-sm mt-2">
                    <span>{item.release_date.slice(0, 4)}</span>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        {Math.floor(
                          (Date.now() - item.addedDate) / (1000 * 60 * 60 * 24)
                        )}{" "}
                        days ago
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-lg">
                      ⭐ {item.vote_average.toFixed(1)}
                    </div>
                    <p className="text-slate-400 text-xs">Rating</p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mylist;


