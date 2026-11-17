
(function () {
    const TRACKS = {
        "off-the-wall": [
            ["Don't Stop 'Til You Get Enough", 365], ["Rock with You", 220],
            ["Working Day and Night", 338], ["Get on the Floor", 246],
            ["Off the Wall", 254], ["Girlfriend", 151],
            ["She's Out of My Life", 217], ["I Can't Help It", 238],
            ["It's the Falling in Love", 240], ["Burn This Disco Out", 239],
        ],
        "thriller": [
            ["Wanna Be Startin' Somethin'", 363], ["Baby Be Mine", 260],
            ["The Girl Is Mine", 222], ["Thriller", 357], ["Beat It", 258],
            ["Billie Jean", 294], ["Human Nature", 246],
            ["P.Y.T. (Pretty Young Thing)", 239], ["The Lady in My Life", 298],
        ],
        "bad": [
            ["Bad", 247], ["The Way You Make Me Feel", 299], ["Speed Demon", 241],
            ["Liberian Girl", 233], ["Just Good Friends", 238],
            ["Another Part of Me", 233], ["Man in the Mirror", 319],
            ["I Just Can't Stop Loving You", 240], ["Dirty Diana", 280],
            ["Smooth Criminal", 257], ["Leave Me Alone", 287],
        ],
        "rio": [
            ["Rio", 252], ["My Own Way", 226], ["Hungry Like the Wolf", 233],
            ["Lonely in Your Nightmare", 245], ["Hold Back the Rain", 300],
            ["New Religion", 223], ["Last Chance on the Stairway", 217],
            ["Save a Prayer", 294], ["The Chauffeur", 293],
        ],
    };

    function buildTracks(albumKey, extras = []) {
        const base = TRACKS[albumKey];
        const head = base.map(([title, duration], i) => ({
            number: i + 1,
            title,
            duration,
            providerIds: {},
        }));
        const tail = extras.map((t, i) => ({
            number: base.length + i + 1,
            title: t.title,
            duration: t.duration,
            providerIds: {},
        }));
        return [...head, ...tail];
    }

    const providers = [
        { id: "musicbrainz", name: "MusicBrainz", color: "#BA478F" },
        { id: "qobuz",       name: "Qobuz",       color: "#0C1E3C" },
        { id: "deezer",      name: "Deezer",      color: "#A238FF" },
    ];

    const artists = [
        {
            id: "artist:duran-duran",
            name: "Duran Duran",
            type: "Group",
            country: "GB",
            beginDate: "1978",
            providerIds: {},
        },
        {
            id: "artist:michael-jackson",
            name: "Michael Jackson",
            type: "Person",
            country: "US",
            beginDate: "1964",
            providerIds: {
                musicbrainz: "f27ec8db-af05-4f36-916e-3d57f91ecf5e",
            },
        },
    ];

    const albums = [
        {
            id: "album:michael-jackson:off-the-wall",
            artistId: "artist:michael-jackson",
            title: "Off the Wall",
            releaseGroupMbid: null,
            firstReleaseDate: "1979-08-10",
            primaryType: "Album",
            secondaryTypes: [],
            coverArtUrl: null,
            canonicalVariantId: "variant:off-the-wall:1979-us-vinyl",
            providerIds: {},
            variants: [
                {
                    id: "variant:off-the-wall:1979-us-vinyl",
                    releaseMbid: null,
                    title: "Off the Wall",
                    date: "1979-08-10",
                    country: "US",
                    status: "Official",
                    format: "Vinyl",
                    label: "Epic",
                    barcode: null,
                    providerIds: {},
                    tracks: buildTracks("off-the-wall"),
                },
            ],
        },

        {
            id: "album:michael-jackson:thriller",
            artistId: "artist:michael-jackson",
            title: "Thriller",
            releaseGroupMbid: null,
            firstReleaseDate: "1982-11-30",
            primaryType: "Album",
            secondaryTypes: [],
            coverArtUrl: null,
            canonicalVariantId: "variant:thriller:1982-us-vinyl",
            providerIds: {},
            variants: [
                {
                    id: "variant:thriller:1982-us-vinyl",
                    releaseMbid: null,
                    title: "Thriller",
                    date: "1982-11-30",
                    country: "US",
                    status: "Official",
                    format: "Vinyl",
                    label: "Epic",
                    barcode: null,
                    providerIds: {},
                    tracks: buildTracks("thriller"),
                },
            ],
        },

        {
            id: "album:michael-jackson:bad",
            artistId: "artist:michael-jackson",
            title: "Bad",
            releaseGroupMbid: null,
            firstReleaseDate: "1987-08-31",
            primaryType: "Album",
            secondaryTypes: [],
            coverArtUrl: null,
            canonicalVariantId: "variant:bad:1987-us-vinyl",
            providerIds: {},
            variants: [
                {
                    id: "variant:bad:1987-us-vinyl",
                    releaseMbid: null,
                    title: "Bad",
                    date: "1987-08-31",
                    country: "US",
                    status: "Official",
                    format: "Vinyl",
                    label: "Epic",
                    barcode: null,
                    providerIds: {},
                    tracks: buildTracks("bad"),
                },
            ],
        },

        {
            id: "album:duran-duran:rio",
            artistId: "artist:duran-duran",
            title: "Rio",
            releaseGroupMbid: null,
            firstReleaseDate: "1982-03-29",
            primaryType: "Album",
            secondaryTypes: [],
            coverArtUrl: null,
            canonicalVariantId: "variant:rio:1982-gb-vinyl",
            providerIds: {},
            variants: [
                {
                    id: "variant:rio:1982-gb-vinyl",
                    releaseMbid: null,
                    title: "Rio",
                    date: "1982-03-29",
                    country: "GB",
                    status: "Official",
                    format: "Vinyl",
                    label: "EMI",
                    barcode: null,
                    providerIds: {},
                    tracks: buildTracks("rio"),
                },
            ],
        },
    ];

    window.MUSICMAP_DB = { providers, artists, albums };
})();