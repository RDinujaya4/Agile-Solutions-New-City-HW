import '../styles/Loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loading-text">
        Loading<span className="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}
