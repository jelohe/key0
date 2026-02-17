import './notfound.css';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="not-found container">
      <header>
        <h1>404</h1>
        <p>Page not found.</p>
      </header>

      <section className="cta">
        <button onClick={() => navigate("/")}>Go home</button>
      </section>
    </div>
  );
}
