export function AnnouncementBar() {
  return (
    <div className="announce-bar">
      <span className="announce-dot" />
      <span className="announce-text">
        vital.sandbox is currently in active development — APIs and features are subject to change. Not recommended for production use.
      </span>
      <a href="#" className="announce-link">
        View Roadmap
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
