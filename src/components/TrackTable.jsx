import TrackRow from "./TrackRow";
import EmptyState from "./EmptyState";

export default function TrackTable({ tracks }) {
    if (!tracks.length) {
        return <EmptyState message="No tracks in this album." />;
    }
    return (
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
            {tracks.map((t) => <TrackRow key={t.id} track={t} />)}
            </tbody>
        </table>
    );
}