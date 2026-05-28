// App.tsx

import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import TVshow from "./pages/TVshow";
import Movie from "./pages/Movie";
import Popular from "./pages/Popular";
import Mylist from "./pages/Mylist";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ActorDetail from "./pages/ActorDetail";
import DetailMovie from "./pages/DetailMovie";


import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <TopNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tv" element={<TVshow />} />
        <Route path="/movies" element={<Movie />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/my-list" element={<Mylist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Movie Detail */}
        <Route
          path="/movie/:id"
          element={<DetailMovie />}
        />

        {/* Actor Detail */}
        <Route
          path="/person/:id"
          element={<ActorDetail />}
        />
      </Routes>
    </>
  );
}

export default App;