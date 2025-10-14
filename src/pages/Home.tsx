import React from "react";
import Banner from "../components/Banner";
import MovieRow from "../components/MovieRow";
import ModalDetail from "../components/ModalDetail";
import { type Movie } from "../components/MovieCard";

const sampleMovies: Movie[] = [
  {
    id: "1",
    category:"",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    rating: 8.8,
  },
  {
    id: "2",
    category:"",
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.6,
  },
  {
    id: "3",
    category:"",
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
    rating: 9.0,
  },
  {
    id: "4",
    category:"",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 8.5,
  },
  {
    id: "5",
    category:"",
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    rating: 7.9,
  },
  {
    id: "6",
    category:"",
    title: "John Wick 4",
    poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    rating: 8.1,
  },
  
];

const Home: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Movie | null>(null);

  const onSelect = (m: Movie) => {
    setSelected(m);
    setOpen(true);
  };

  return (
    <div className="bg-black min-h-screen pb-20">
      <Banner />
      <div className="space-y-8 -mt-16">
        <MovieRow title="Popular on Netflix" movies={sampleMovies} onSelect={onSelect} />
        <MovieRow title="Trending Now" movies={[...sampleMovies].reverse()} onSelect={onSelect} />
        <MovieRow title="Top Rated" movies={sampleMovies} onSelect={onSelect} />
      </div>

      <ModalDetail open={open} movie={selected} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Home;

