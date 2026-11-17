export default function About() {
    return (
        <section className="about">
            <h1>About MusicMap</h1>
            <p>
                MusicMap is a prototype that links an artist, album, or track to its
                equivalent entry across MusicBrainz, Qobuz, Deezer, and Spotify. It lets
                you traverse a discography once, then jump straight to the same release
                on whichever streaming service you prefer.
            </p>
            <h2>How it works</h2>
            <p>
                Every record in our mock data carries an <code>externalIds</code> map —
                a dictionary of service ID → external ID. The UI reads that map to
                decide which service badges to show, and builds deep links using each
                service's base URL.
            </p>
            <h2>What's mocked</h2>
            <p>
                All data lives in <code>src/data/*.json</code>. Real API integration is
                out of scope for this milestone, but the JSON shape mirrors what a
                MusicBrainz + Qobuz + Deezer pipeline would return, so a future{" "}
                <code>useFetch</code> hook could swap in without changing any UI
                component.
            </p>
        </section>
    );
}