import { useFavorites } from "../hooks/useFavorites";

export default function FavoriteButton({ albumId }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const active = isFavorite(albumId);

    return (
        <button
            type="button"
            className={`favorite-btn${active ? " active" : ""}`}
            onClick={() => toggleFavorite(albumId)}
            aria-pressed={active}
            title={active ? "Remove from favorites" : "Add to favorites"}
        >
            {active ? "♥" : "♡"} {active ? "Favorited" : "Favorite"}
        </button>
    );
}