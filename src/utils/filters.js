export function searchArtists(artists, query) {
    const q = query.toLowerCase().trim();
    if (!q) return artists;
    return artists.filter((a) => a.name.toLowerCase().includes(q));
}

export function filterByType(albums, type) {
    if (!type || type === "All") return albums;
    return albums.filter((a) => a.type === type);
}

export function filterByService(albums, serviceIds) {
    if (!serviceIds.length) return albums;
    return albums.filter((a) => serviceIds.every((id) => a.externalIds?.[id]));
}