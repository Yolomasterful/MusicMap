import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import artists from "../data/artists.json";
import services from "../data/services.json";
import AlbumCard from "../components/AlbumCard";
import ServiceBadge from "../components/ServiceBadge";
import ServiceFilter from "../components/ServiceFilter";
import TypeFilter from "../components/TypeFilter";
import EmptyState from "../components/EmptyState";
import { useArtistAlbums } from "../hooks/useArtistAlbums";

export default function Artist() {
    const { artistId } = useParams();
    const artist = artists.find((a) => a.id === artistId);

    const [type, setType] = useState("All");
    const [selectedServices, setSelectedServices] = useState([]);
    const [sort, setSort] = useState("date-desc");

    const albums = useArtistAlbums(artistId, {
        type,
        services: selectedServices,
        sort,
    });

    if (!artist) return <EmptyState message="Artist not found." />;

    return (
        <>
            <section className="artist-hero">
                <img src={artist.imageUrl} alt={artist.name} />
                <div className="artist-hero-info">
                    <h1>{artist.name}</h1>
                    <p>
                        {artist.country} · {artist.type} · active since {artist.beginDate}
                    </p>
                    <div className="service-links">
                        {services.map((s) =>
                            artist.externalIds?.[s.id] ? (
                                <ServiceBadge
                                    key={s.id}
                                    service={s}
                                    entityType="artist"
                                    externalId={artist.externalIds[s.id]}
                                />
                            ) : null
                        )}
                    </div>
                    <Link to="/" className="back-link">← Back to search</Link>
                </div>
            </section>

            <section className="discography">
                <div className="discography-header">
                    <h2>Discography ({albums.length})</h2>
                    <div className="discography-controls">
                        <TypeFilter value={type} onChange={setType} />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            aria-label="Sort albums"
                        >
                            <option value="date-desc">Newest first</option>
                            <option value="date-asc">Oldest first</option>
                            <option value="title">Title A–Z</option>
                        </select>
                    </div>
                </div>

                <ServiceFilter
                    selected={selectedServices}
                    onChange={setSelectedServices}
                />

                {albums.length === 0 ? (
                    <EmptyState message="No albums match your filters." />
                ) : (
                    <div className="album-grid">
                        {albums.map((al) => <AlbumCard key={al.id} album={al} />)}
                    </div>
                )}
            </section>
        </>
    );
}