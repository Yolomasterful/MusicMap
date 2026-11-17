export function formatDuration(seconds) {
    if (typeof seconds !== "number") return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatYear(dateStr) {
    return dateStr ? dateStr.slice(0, 4) : "";
}