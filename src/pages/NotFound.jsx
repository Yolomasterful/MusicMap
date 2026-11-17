import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <section className="not-found">
            <h1>404</h1>
            <p>We couldn't find that page.</p>
            <Link to="/" className="back-link">← Back home</Link>
        </section>
    );
}