import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="site-header">
            <NavLink to="/" className="logo">
                <span className="logo-mark">♫</span> MusicMap
            </NavLink>
            <nav className="main-nav">
                <NavLink to="/" end>Home</NavLink>
                <NavLink to="/favorites">Favorites</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>
        </header>
    );
}