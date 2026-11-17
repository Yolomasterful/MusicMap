const SERVICE_PATHS = {
    musicbrainz: { artist: "artist", album: "release", track: "recording" },
    qobuz:       { artist: "artist", album: "album",   track: "track" },
    deezer:      { artist: "artist", album: "album",   track: "track" },
    spotify:     { artist: "artist", album: "album",   track: "track" },
};

export function getServiceUrl(service, entityType, externalId) {
    if (!externalId) return null;
    const path = SERVICE_PATHS[service.id]?.[entityType];
    if (!path) return null;
    return `${service.baseUrl}/${path}/${externalId}`;
}

export function getAvailableServices(record, services) {
    return services.filter((s) => record.externalIds?.[s.id]);
}