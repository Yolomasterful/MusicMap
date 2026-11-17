import { getServiceUrl } from "../utils/helpers";

export default function ServiceBadge({ service, entityType, externalId, mini = false }) {
    const url = getServiceUrl(service, entityType, externalId);
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`service-badge${mini ? " mini" : ""}`}
            style={{ background: service.color }}
        >
            {service.name}
        </a>
    );
}