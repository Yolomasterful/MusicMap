import { useParams, Link } from "react-router-dom";
import albums from "../data/albums.json";
import tracks from "../data/tracks.json";
import artists from "../data/artists.json";
import services from "../data/services.json";
import TrackTable from "../components/TrackTable";
import FavoriteButton from "../components/FavoriteButton";
import EmptyState from "../components/EmptyState";
import { getServiceUrl } from "../utils/helpers";

export default function Album() {
    const { albumId } = useParams();
    const album = albums.find((a) => a.id === albumId);
    const artist = artists.find((a) => a.id === album?.artistId);
    const albumTracks = tracks
        .filter((t) => t.albumId === albumId)
        .sort((a, b) => a.trackNumber - b.trackNumber);

    if (!album) return <EmptyState message="Album not found." />;

    const available = services.filter((s) => album.externalIds?.[s.id]);

    return (
        <div className="album-layout">
            <section className="album-main">
                <div className="album-header">
                    <img src={album.coverArtUrl} alt={album.title} className="cover" />
                    <div>
                        <h1>{album.title}</h1>
                        <p>
                            by{" "}
                            {artist ? (
                                <Link to={`/artist/${artist.id}`}>
                                    <strong>{artist.name}</strong>
                                </Link>
                            ) : (
                                <strong>Unknown Artist</strong>
                            )}{" "}
                            · {album.releaseDate} · {album.type}
                        </p>
                        <FavoriteButton albumId={album.id} />
                    </div>
                </div>

                <h2>Tracks</h2>
                <TrackTable tracks={albumTracks} />
            </section>

            <aside className="album-aside">
                <h2>Listen on</h2>
                <p className="muted">
                    {available.length} of {services.length} services
                </p>
                <ul className="service-list">
                    {services.map((s) => {
                        const id = album.externalIds?.[s.id];
                        const url = getServiceUrl(s, "album", id);
                        return (
                            <li key={s.id} className={id ? "available" : "missing"}>
                                <span className="service-dot" style={{ background: s.color }} />
                                {url ? (
                                    <a href={url} target="_blank" rel="noreferrer">
                                        {s.name} ↗
                                    </a>
                                ) : (
                                    <span>{s.name} — not available</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </div>
    );
}