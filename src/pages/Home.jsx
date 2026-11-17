import { useState } from "react";
import artists from "../data/artists.json";
import SearchBar from "../components/SearchBar";
import ArtistCard from "../components/ArtistCard";
import EmptyState from "../components/EmptyState";
import { searchArtists } from "../utils/filters";

export default function Home() {
    const [query, setQuery] = useState("");
    const results = searchArtists(artists, query);

    return (
        <>
            <section className="hero">
                <h1>Music Map</h1>
                <p>
                    Find any artist, album, or track — then jump straight to it on Qobuz,
                    Deezer, Spotify, and MusicBrainz.
                </p>
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search artists…"
                />
            </section>

            <section className="featured">
                <h2>{query ? `Results for “${query}”` : "Featured Artists"}</h2>
                {results.length === 0 ? (
                    <EmptyState message={`No artists match “${query}”.`} />
                ) : (
                    <div className="artist-grid">
                        {results.map((a) => <ArtistCard key={a.id} artist={a} />)}
                    </div>
                )}
            </section>
        </>
    );
}