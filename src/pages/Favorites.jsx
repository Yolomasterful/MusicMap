import albums from "../data/albums.json";
import AlbumCard from "../components/AlbumCard";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../hooks/useFavorites";

export default function Favorites() {
    const { favorites } = useFavorites();
    const favoriteAlbums = albums.filter((a) => favorites.includes(a.id));

    return (
        <section>
            <h1>Your Favorites</h1>
            <p className="muted">
                {favoriteAlbums.length} album(s) saved on this device.
            </p>
            {favoriteAlbums.length === 0 ? (
                <EmptyState message="No favorites yet. Browse an artist and tap ♡ on an album." />
            ) : (
                <div className="album-grid">
                    {favoriteAlbums.map((a) => <AlbumCard key={a.id} album={a} />)}
                </div>
            )}
        </section>
    );
}