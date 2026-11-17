export default function TypeFilter({ value, onChange }) {
    return (
        <select
            className="type-filter"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Album type filter"
        >
            <option value="All">All types</option>
            <option value="Album">Album</option>
            <option value="EP">EP</option>
            <option value="Single">Single</option>
            <option value="Live">Live</option>
        </select>
    );
}