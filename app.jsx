const { useState, useEffect, useMemo } = React;
const DB = window.MUSICMAP_DB;

function parseHash() {
    const hash = window.location.hash.slice(1) || "/";
    const parts = hash.split("/").filter(Boolean);
    if (!parts.length) return { page: "home" };
    if (parts[0] === "artist" && parts[1]) return { page: "artist", artistId: parts[1] };
    if (parts[0] === "album" && parts[1]) return { page: "album", albumId: parts[1], variantId: parts[2] || null };
    if (parts[0] === "about") return { page: "about" };
    return { page: "notfound" };
}

function useRoute() {
    const [route, setRoute] = useState(parseHash);
    useEffect(() => {
        const onChange = () => setRoute(parseHash());
        window.addEventListener("hashchange", onChange);
        return () => window.removeEventListener("hashchange", onChange);
    }, []);
    return route;
}

const getArtist        = (id)    => DB.artists.find((a) => a.id === id);
const getAlbum         = (id)    => DB.albums.find((a) => a.id === id);
const getAlbumsByArtist = (id)   => DB.albums.filter((a) => a.artistId === id);
const getProvider      = (id)    => DB.providers.find((p) => p.id === id);
const getCanonical     = (album) => album.variants.find((v) => v.id === album.canonicalVariantId);
const getVariant       = (album, id) => album.variants.find((v) => v.id === id) || getCanonical(album);

const formatDuration = (s) => {
    if (typeof s !== "number" || Number.isNaN(s)) return "—";
    const m = Math.floor(s / 60);
    const rem = Math.round(s % 60);
    return `${m}:${String(rem).padStart(2, "0")}`;
};

function serviceUrl(providerId, entityType, id) {
    if (!id) return null;
    if (providerId === "musicbrainz") {
        if (entityType === "artist") return `https://musicbrainz.org/artist/${id}`;
        if (entityType === "album")  return `https://musicbrainz.org/release-group/${id}`;
        if (entityType === "track")  return `https://musicbrainz.org/recording/${id}`;
        if (entityType === "release") return `https://musicbrainz.org/release/${id}`;
    }
    if (providerId === "qobuz") {
        if (entityType === "album") return `https://open.qobuz.com/album/${id}`;
        if (entityType === "track") return `https://open.qobuz.com/track/${id}`;
    }
    if (providerId === "deezer") {
        if (entityType === "album") return `https://www.deezer.com/album/${id}`;
        if (entityType === "track") return `https://www.deezer.com/track/${id}`;
    }
    return null;
}

function Header() {
    return (
        <header className="site-header">
            <a href="#/" className="logo"><span className="logo-mark">♫</span> MusicMap</a>
            <nav className="main-nav">
                <a href="#/">Home</a>
                <a href="#/about">About</a>
            </nav>
        </header>
    );
}

function Footer() {
    return (
        <footer className="site-footer">
            <p>© 2026 MusicMap — mock data, no live API calls.</p>
        </footer>
    );
}

function ServiceDot({ providerId }) {
    const p = getProvider(providerId);
    if (!p) return null;
    return <span className="service-dot" style={{ background: p.color }} title={p.name} />;
}

function ServiceBadge({ providerId, entityType, id, mini = false }) {
    const p = getProvider(providerId);
    if (!p) return null;
    const href = serviceUrl(providerId, entityType, id);
    if (!href) {
        return (
            <span className={`service-badge${mini ? " mini" : ""} missing`} style={{ background: p.color }}>
        {p.name}
      </span>
        );
    }
    return (
        <a href={href} target="_blank" rel="noreferrer"
           className={`service-badge${mini ? " mini" : ""}`}
           style={{ background: p.color }}>
            {p.name}
        </a>
    );
}

function EmptyState({ message = "Nothing here yet." }) {
    return <p className="empty-state">{message}</p>;
}

function ArtistCard({ artist }) {
    return (
        <a href={`#/artist/${artist.id}`} className="artist-card">
            <div style={{ aspectRatio: "1 / 1", background: "linear-gradient(135deg, #2a2a3a, #1a1a24)",
                display: "grid", placeItems: "center", fontSize: "3rem", color: "var(--accent)" }}>
                {artist.name.slice(0, 1)}
            </div>
            <div className="card-body">
                <h3>{artist.name}</h3>
                <p>{artist.country} · since {artist.beginDate}</p>
            </div>
        </a>
    );
}

function AlbumCard({ album }) {
    const canonical = getCanonical(album);
    const providers = DB.providers.filter((p) => canonical.providerIds[p.id]);
    const year = (album.firstReleaseDate || "").slice(0, 4);
    const hasVariants = album.variants.length > 1;

    return (
        <a href={`#/album/${album.id}`} className="album-card">
            <div style={{ aspectRatio: "1 / 1", background: "linear-gradient(135deg, #2a2a3a, #1a1a24)",
                display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
                ♫
            </div>
            <div className="card-body">
                <h3>{album.title}</h3>
                <p>
                    {year} · {album.primaryType}
                    {hasVariants && ` · ${album.variants.length} editions`}
                </p>
                <div className="service-dots">
                    {providers.map((p) => <ServiceDot key={p.id} providerId={p.id} />)}
                </div>
            </div>
        </a>
    );
}

function VariantRow({ album, variant }) {
    const isCanonical = variant.id === album.canonicalVariantId;
    const providers = DB.providers.filter((p) => variant.providerIds[p.id]);
    return (
        <a href={`#/album/${album.id}/${variant.id}`}
           className={`variant-row${isCanonical ? " canonical" : ""}`}>
            <div>
                <strong>
                    {variant.title}
                    {isCanonical && <span className="canonical-marker">Canonical</span>}
                </strong>
                <div className="meta">
                    {variant.date} · {variant.country} · {variant.status} · {variant.format}
                    {variant.barcode && ` · UPC ${variant.barcode}`}
                </div>
            </div>
            <div className="badges">
                {providers.length
                    ? providers.map((p) => <ServiceBadge key={p.id} providerId={p.id} entityType="album" id={variant.providerIds[p.id]} mini />)
                    : <span className="meta">No provider match</span>}
            </div>
        </a>
    );
}

function HomePage() {
    const [query, setQuery] = useState("");
    const results = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return DB.artists;
        return DB.artists.filter((a) => a.name.toLowerCase().includes(q));
    }, [query]);

    return (
        <>
            <section className="hero">
                <h1>Map Your Music</h1>
                <p>
                    Browse artists from the local mock database. Every album is matched
                    to Qobuz and Deezer, with hidden variants a click away.
                </p>
                <input
                    className="search-input"
                    placeholder="Search artists…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </section>

            <section style={{ marginTop: "2.5rem" }}>
                <h2>{query ? `Results for "${query}"` : "Artists"}</h2>
                {results.length === 0
                    ? <EmptyState message={`No artists match "${query}".`} />
                    : (
                        <div className="artist-grid">
                            {results.map((a) => <ArtistCard key={a.id} artist={a} />)}
                        </div>
                    )}
            </section>
        </>
    );
}

function ArtistPage({ artistId }) {
    const artist = getArtist(artistId);
    const [showVariants, setShowVariants] = useState(false);
    const [type, setType] = useState("All");
    const [sort, setSort] = useState("date-desc");

    if (!artist) return <EmptyState message="Artist not found." />;

    const albums = getAlbumsByArtist(artistId);
    const filtered = useMemo(() => {
        let list = albums;
        if (type !== "All") {
            list = list.filter((a) => {
                if (type === "Live") return (a.secondaryTypes || []).includes("Live");
                return a.primaryType === type;
            });
        }
        const dateOf = (a) => a.firstReleaseDate || "";
        if (sort === "date-desc") list = [...list].sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
        if (sort === "date-asc")  list = [...list].sort((a, b) => dateOf(a).localeCompare(dateOf(b)));
        if (sort === "title")     list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        return list;
    }, [albums, type, sort]);

    return (
        <>
            <section className="artist-hero">
                <div style={{ width: 160, height: 160, borderRadius: "var(--radius)",
                    background: "linear-gradient(135deg, #2a2a3a, #1a1a24)",
                    display: "grid", placeItems: "center",
                    fontSize: "4rem", color: "var(--accent)", flexShrink: 0 }}>
                    {artist.name.slice(0, 1)}
                </div>
                <div className="artist-hero-info">
                    <h1>{artist.name}</h1>
                    <p>{artist.country} · {artist.type} · active since {artist.beginDate}</p>
                    <div className="service-links">
                        {DB.providers.map((p) =>
                            artist.providerIds[p.id]
                                ? <ServiceBadge key={p.id} providerId={p.id} entityType="artist" id={artist.providerIds[p.id]} />
                                : null
                        )}
                    </div>
                    <a href="#/" className="back-link">← Back to search</a>
                </div>
            </section>

            <section style={{ marginTop: "2.5rem" }}>
                <div className="discography-header">
                    <h2>Discography ({filtered.length})</h2>
                    <div className="controls">
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="All">All types</option>
                            <option value="Album">Album</option>
                            <option value="EP">EP</option>
                            <option value="Single">Single</option>
                            <option value="Live">Live</option>
                        </select>
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="date-desc">Newest first</option>
                            <option value="date-asc">Oldest first</option>
                            <option value="title">Title A–Z</option>
                        </select>
                        <label className="variant-toggle">
                            <input
                                type="checkbox"
                                checked={showVariants}
                                onChange={(e) => setShowVariants(e.target.checked)}
                            />
                            Show all variants
                        </label>
                    </div>
                </div>

                {filtered.length === 0
                    ? <EmptyState message="No releases match your filters." />
                    : showVariants
                        ? (
                            <div className="variant-list">
                                {filtered.flatMap((album) =>
                                    album.variants.map((v) => (
                                        <VariantRow key={v.id} album={album} variant={v} />
                                    ))
                                )}
                            </div>
                        )
                        : (
                            <div className="album-grid">
                                {filtered.map((a) => <AlbumCard key={a.id} album={a} />)}
                            </div>
                        )}
            </section>
        </>
    );
}

function AlbumPage({ albumId, variantId }) {
    const album = getAlbum(albumId);
    const [showEditions, setShowEditions] = useState(false);

    if (!album) return <EmptyState message="Album not found." />;

    const variant = variantId ? getVariant(album, variantId) : getCanonical(album);
    const artist = getArtist(album.artistId);
    const isCanonical = variant.id === album.canonicalVariantId;
    const providers = DB.providers.filter((p) => variant.providerIds[p.id]);
    const mbLink = serviceUrl("musicbrainz", "release", variant.releaseMbid);

    return (
        <>
            <div className="album-layout">
                <section>
                    <div className="album-header">
                        <div className="cover" style={{ background: "linear-gradient(135deg, #2a2a3a, #1a1a24)",
                            display: "grid", placeItems: "center",
                            fontSize: "3rem", color: "var(--accent)" }}>
                            ♫
                        </div>
                        <div>
                            <h1>
                                {variant.title}
                                {isCanonical && <span className="canonical-marker" style={{ marginLeft: ".5rem" }}>Canonical</span>}
                            </h1>
                            <p>
                                by{" "}
                                {artist
                                    ? <a href={`#/artist/${artist.id}`}><strong>{artist.name}</strong></a>
                                    : <strong>Unknown Artist</strong>}
                                {" · "}{variant.date}{" · "}{variant.country}{" · "}{variant.format}
                                {variant.barcode && ` · UPC ${variant.barcode}`}
                            </p>
                            <a href={`#/artist/${album.artistId}`} className="back-link">← Back to artist</a>
                        </div>
                    </div>

                    <h2>Tracks ({variant.tracks.length})</h2>
                    <table className="track-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Duration</th>
                            <th>Listen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {variant.tracks.map((t) => (
                            <tr key={t.number}>
                                <td>{t.number}</td>
                                <td>{t.title}</td>
                                <td>{formatDuration(t.duration)}</td>
                                <td>
                                    <div className="track-links">
                                        {Object.keys(t.providerIds).length === 0
                                            ? <span className="muted">—</span>
                                            : DB.providers
                                                .filter((p) => t.providerIds[p.id])
                                                .map((p) => (
                                                    <ServiceBadge
                                                        key={p.id}
                                                        providerId={p.id}
                                                        entityType="track"
                                                        id={t.providerIds[p.id]}
                                                        mini
                                                    />
                                                ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <section className="editions">
                        <h2>
                            Editions
                            {album.variants.length > 1 && (
                                <button
                                    className="editions-toggle"
                                    style={{ marginLeft: "1rem" }}
                                    onClick={() => setShowEditions((s) => !s)}
                                >
                                    {showEditions ? "Hide" : `Show all ${album.variants.length}`}
                                </button>
                            )}
                        </h2>
                        {showEditions && (
                            <div className="editions-list">
                                {album.variants.map((v) => (
                                    <VariantRow key={v.id} album={album} variant={v} />
                                ))}
                            </div>
                        )}
                    </section>
                </section>

                <aside className="album-aside">
                    <h2>Listen on</h2>
                    {providers.length === 0
                        ? <p className="muted">No provider match for this edition.</p>
                        : (
                            <ul className="service-list">
                                {providers.map((p) => {
                                    const href = serviceUrl(p.id, "album", variant.providerIds[p.id]);
                                    return (
                                        <li key={p.id}>
                                            <ServiceDot providerId={p.id} />
                                            <a href={href} target="_blank" rel="noreferrer">{p.name} ↗</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    {mbLink && (
                        <p style={{ marginTop: "1rem", fontSize: ".85rem" }}>
                            <a href={mbLink} target="_blank" rel="noreferrer" className="muted">
                                View on MusicBrainz ↗
                            </a>
                        </p>
                    )}
                </aside>
            </div>
        </>
    );
}

function AboutPage() {
    return (
        <section className="about">
            <h1>About MusicMap</h1>
            <p>
                MusicMap links every artist, album, and track to its equivalent on
                MusicBrainz, Qobuz, and Deezer. It works entirely from a local mock
                database — no live API calls, no rate limits, no CORS headaches.
            </p>
            <h2>How matching works</h2>
            <p>
                Each MusicBrainz <em>release-group</em> (the abstract album) becomes a
                single record with <code>variants[]</code> — one entry per MusicBrainz
                release (physical or digital edition). Only one variant is shown by
                default: the <strong>canonical</strong> one, chosen as the variant
                whose track list matches the most providers.
            </p>
            <p>
                Every other variant still exists in the data. If another provider's
                catalogue happens to match a <em>different</em> edition (say, Deezer
                lists the 2008 reissue while Qobuz lists the 1997 original), that
                edition's <code>providerIds</code> will contain the match. Expand the
                album's editions to see it.
            </p>
            <h2>Data model</h2>
            <p>
                <code>artists[]</code> — 1:1 across providers. Each carries a{" "}
                <code>providerIds</code> map.
            </p>
            <p>
                <code>albums[]</code> — has a <code>canonicalVariantId</code> and a{" "}
                <code>variants[]</code> array. The album-level <code>providerIds</code>{" "}
                always mirrors the canonical variant.
            </p>
            <p>
                <code>variants[]</code> — one entry per MusicBrainz release. Each has
                its own <code>providerIds</code> (empty <code>{"{}"}</code> when it
                does not match any provider), plus its own <code>tracks[]</code>.
            </p>
            <p>
                <code>tracks[]</code> — every track carries its own{" "}
                <code>providerIds</code>, so deep links can go straight to a specific
                track on Qobuz or Deezer.
            </p>
            <h2>Try it</h2>
            <p>
                Open <strong>Mordechai</strong> by Khruangbin. Its canonical edition
                matches Qobuz only. Expand its editions and you'll see a second
                variant — the US vinyl — matched to Deezer. Or open{" "}
                <strong>OK Computer</strong> and expand its three editions to see how
                the canonical pick compares to the JP and OKNOTOK variants, neither of
                which matches any provider.
            </p>
        </section>
    );
}

function NotFoundPage() {
    return (
        <section style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <h1 style={{ fontSize: "4rem", color: "var(--accent)" }}>404</h1>
            <p>Page not found.</p>
            <a href="#/" className="back-link">← Back home</a>
        </section>
    );
}

function App() {
    const route = useRoute();
    let page;
    if      (route.page === "home")   page = <HomePage />;
    else if (route.page === "artist") page = <ArtistPage artistId={route.artistId} />;
    else if (route.page === "album")  page = <AlbumPage albumId={route.albumId} variantId={route.variantId} />;
    else if (route.page === "about")  page = <AboutPage />;
    else                              page = <NotFoundPage />;

    return (
        <>
            <Header />
            <main className="page">{page}</main>
            <Footer />
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);