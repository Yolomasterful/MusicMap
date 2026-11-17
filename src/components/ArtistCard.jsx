import { Link } from "react-router-dom";

export default function ArtistCard({ artist }) {
    return (
        <Link to={`/artist/${artist.id}`} className="artist-card">
            <img
                src={artist.imageUrl}
                alt={artist.name}
                title={`Photo of ${artist.name} (Unsplash placeholder)`}
                loading="lazy"
            />
            <div className="card-body">
                <h3>{artist.name}</h3>
                <p>{artist.country} · since {artist.beginDate}</p>
            </div>
        </Link>
    );
}