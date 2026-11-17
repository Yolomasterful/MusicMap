import services from "../data/services.json";
import ServiceBadge from "./ServiceBadge";
import { formatDuration } from "../utils/formatters";

export default function TrackRow({ track }) {
    const badges = services.filter((s) => track.externalIds?.[s.id]);
    return (
        <tr>
            <td>{track.trackNumber}</td>
            <td>{track.title}</td>
            <td>{formatDuration(track.duration)}</td>
            <td className="track-listen">
                {badges.length ? (
                    badges.map((s) => (
                        <ServiceBadge
                            key={s.id}
                            service={s}
                            entityType="track"
                            externalId={track.externalIds[s.id]}
                            mini
                        />
                    ))
                ) : (
                    <span className="muted">—</span>
                )}
            </td>
        </tr>
    );
}