import { useMemo } from "react";
import albums from "../data/albums.json";
import { filterByService, filterByType } from "../utils/filters";

export function useArtistAlbums(
    artistId,
    { type = "All", services = [], sort = "date-desc" } = {}
) {
    const serviceKey = services.join("|");

    return useMemo(() => {
        let result = albums.filter((a) => a.artistId === artistId);
        result = filterByType(result, type);
        result = filterByService(result, serviceKey ? serviceKey.split("|") : []);
        result = [...result];

        if (sort === "date-desc") result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        else if (sort === "date-asc") result.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        else if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));

        return result;
    }, [artistId, type, serviceKey, sort]);
}