import services from "../data/services.json";

export default function ServiceFilter({ selected, onChange }) {
    const toggle = (id) => {
        onChange(
            selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
        );
    };

    return (
        <fieldset className="service-filter">
            <legend>Available on</legend>
            {services.map((s) => (
                <label key={s.id} className="service-filter-item">
                    <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggle(s.id)}
                    />
                    <span className="service-dot" style={{ background: s.color }} />
                    {s.name}
                </label>
            ))}
        </fieldset>
    );
}