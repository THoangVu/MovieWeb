// ActorDetail.tsx

import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Calendar,
  MapPin,
  Flame,
  Star,
  ArrowLeft,
} from "lucide-react";

interface Person {
  profile_path: string;
  name: string;
  known_for_department: string;
  gender: number;
  birthday: string;
  deathday?: string;
  place_of_birth: string;
  biography: string;
  popularity: number;
  also_known_as: string[];
  imdb_id: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  character: string;
  vote_average: number;
  credit_id: string;
}

const ActorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        setLoading(true);
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        };

        // Fetch person detail
        const personRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}?language=vi`,
          options
        );
        const personData = await personRes.json();
        setPerson(personData);

        // Fetch movie credits
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?language=vi`,
          options
        );
        const movieData = await movieRes.json();
        setMovies(movieData.cast.filter((m: Movie) => m.poster_path).sort((a: Movie, b: Movie) => 
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        ));
      } catch (err) {
        setError("Failed to load actor details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchActor();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading actor details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || "Actor not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate age
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = person.birthday ? calculateAge(person.birthday) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Header - Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Image */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {/* Profile Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl mb-6 border-2 border-cyan-500/20 hover:border-cyan-500/50 transition">
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w400${person.profile_path}`
                      : "https://via.placeholder.com/400x600?text=No+Image"
                  }
                  alt={person.name}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Social Links */}
              {/* <div className="flex gap-4 mb-8">
                <a
                  href={`https://www.imdb.com/name/${person.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Star size={18} />
                  IMDb
                </a>
                <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Share
                </button>
              </div> */}

              {/* Personal Info Card */}
              <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/20 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Personal Info</h3>

                {/* Known For */}
                <div className="border-b border-slate-700/50 pb-4">
                  <p className="text-slate-400 text-sm font-semibold mb-2">KNOWN FOR</p>
                  <p className="text-white font-medium">{person.known_for_department}</p>
                </div>

                {/* Gender */}
                <div className="border-b border-slate-700/50 pb-4">
                  <p className="text-slate-400 text-sm font-semibold mb-2">GENDER</p>
                  <p className="text-white font-medium">{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Not specified"}</p>
                </div>

                {/* Birthday */}
                {person.birthday && (
                  <div className="border-b border-slate-700/50 pb-4">
                    <p className="text-slate-400 text-sm font-semibold mb-2">DATE OF BIRTH</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-cyan-400" />
                      <span className="text-white font-medium">
                        {new Date(person.birthday).toLocaleDateString("vi-VN")}
                        {age && <span className="text-slate-400 ml-2">({age} years old)</span>}
                      </span>
                    </div>
                  </div>
                )}

                {/* Death Date */}
                {person.deathday && (
                  <div className="border-b border-slate-700/50 pb-4">
                    <p className="text-slate-400 text-sm font-semibold mb-2">DATE OF DEATH</p>
                    <p className="text-white font-medium">{new Date(person.deathday).toLocaleDateString("vi-VN")}</p>
                  </div>
                )}

                {/* Place of Birth */}
                {person.place_of_birth && (
                  <div className="border-b border-slate-700/50 pb-4">
                    <p className="text-slate-400 text-sm font-semibold mb-2">PLACE OF BIRTH</p>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-cyan-400" />
                      <span className="text-white font-medium">{person.place_of_birth}</span>
                    </div>
                  </div>
                )}

                {/* Popularity */}
                <div>
                  <p className="text-slate-400 text-sm font-semibold mb-2">POPULARITY</p>
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-orange-400" />
                    <span className="text-white font-medium">{person.popularity.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="md:col-span-2">
            {/* Name */}
            <h1 className="text-5xl md:text-6xl font-black text-white mb-2">{person.name}</h1>

            {/* Also Known As */}
            {person.also_known_as && person.also_known_as.length > 0 && (
              <p className="text-slate-400 text-lg mb-6">
                Also known as: <span className="text-cyan-400">{person.also_known_as.slice(0, 3).join(", ")}</span>
              </p>
            )}

            {/* Biography */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Biography</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                {person.biography || "No biography available."}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12 bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-xl p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">{movies.length}</p>
                <p className="text-slate-400 text-sm mt-2">Movie Credits</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-400">{person.popularity.toFixed(0)}</p>
                <p className="text-slate-400 text-sm mt-2">Popularity</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{(movies.reduce((acc: number, m: Movie) => acc + m.vote_average, 0) / movies.length).toFixed(1)}</p>
                <p className="text-slate-400 text-sm mt-2">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Known For Section */}
      {movies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Known For</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.slice(0, 12).map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden mb-3 border border-cyan-500/10 hover:border-cyan-500/50 transition">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-[220px] object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Star className="text-yellow-400" size={32} />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-cyan-400 transition">
                  {movie.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">{movie.release_date?.slice(0, 4)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filmography Section */}
      {movies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl font-bold text-white mb-6">Filmography</h2>
          <div className="space-y-2 bg-slate-800/30 backdrop-blur border border-cyan-500/20 rounded-xl overflow-hidden">
            {movies.slice(0, 20).map((movie, index) => (
              <div
                key={movie.credit_id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="px-6 py-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition cursor-pointer last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-semibold w-12">{index + 1}</span>
                      <div>
                        <h3 className="text-white font-semibold text-lg hover:text-cyan-400 transition">
                          {movie.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          as <span className="text-cyan-300">{movie.character}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-slate-400 text-sm">{movie.release_date?.slice(0, 4) || "—"}</p>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                      <Star size={14} />
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorDetail;