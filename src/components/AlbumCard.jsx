import { Link } from "react-router-dom";
import services from "../data/services.json";
import ServiceDot from "./ServiceDot";
import { formatYear } from "../utils/formatters";

export default function AlbumCard({ album }) {
    const available = services.filter((s) => album.externalIds?.[s.id]);
    return (
        <Link to={`/album/${album.id}`} className="album-card">
            <img src={album.coverArtUrl} alt={album.title} loading="lazy" />
            <div className="card-body">
                <h3>{album.title}</h3>
                <p>{formatYear(album.releaseDate)} · {album.type}</p>
                <div className="service-dots">
                    {available.map((s) => <ServiceDot key={s.id} service={s} />)}
                </div>
            </div>
        </Link>
    );
}