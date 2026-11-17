export default function ServiceDot({ service }) {
    return (
        <span
            className="service-dot"
            style={{ background: service.color }}
            title={service.name}
            aria-label={service.name}
        />
    );
}