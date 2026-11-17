import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <BrowserRouter>
            <FavoritesProvider>
                <Header />
                <main className="page-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/artist/:artistId" element={<Artist />} />
                        <Route path="/album/:albumId" element={<Album />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </FavoritesProvider>
        </BrowserRouter>
    );
}