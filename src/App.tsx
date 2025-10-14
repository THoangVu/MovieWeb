
import TopNav from "./components/TopNav"
import Home from "./pages/Home"
import TVshow from "./pages/TVshow"
import Movie from "./pages/Movie"
import Popular from "./pages/Popular"
import Mylist from "./pages/Mylist"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import { Routes, Route } from "react-router-dom"

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
      </Routes>
    </>
  )
}

export default App
