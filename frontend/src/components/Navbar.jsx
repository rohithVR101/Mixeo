import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadVideo } from '../services/api';

/**
 * Navbar — replaces the Bootstrap navbar in header.ejs.
 *
 * Key differences from the EJS version:
 *  - File upload no longer uses a <form> POST that triggers a full page reload.
 *    Instead it calls the /api/upload endpoint via fetch() and navigates to
 *    /editor with the response data stored in React Router location state.
 *  - Navigation uses <Link> instead of <a href>, so the page does not reload.
 */
function Navbar() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const data = await uploadVideo(file);
      // Pass video metadata to the editor via React Router location state.
      // EditorPage reads this with useLocation().state.
      navigate('/editor', { state: data });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand">Mixeo</Link>

      <div className="navbar-links">
        <Link to="/community" className="nav-link">COMMUNITY</Link>
      </div>

      <div className="navbar-upload">
        {/* Hidden file input — label acts as the visible button */}
        <input
          ref={fileInputRef}
          type="file"
          id="videouploader"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={handleFileChange}
          disabled={uploading}
          aria-label="Upload a video file"
        />
        <label
          htmlFor="videouploader"
          className={`btn-upload${uploading ? ' disabled' : ''}`}
          aria-busy={uploading}
        >
          {uploading ? 'UPLOADING...' : 'CREATE A NEW VIDEO'}
        </label>
      </div>

      {/* Inline error toast — shown below the navbar if upload fails */}
      {error && (
        <div
          role="alert"
          style={{
            width: '100%',
            background: '#f8d7da',
            color: '#842029',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
          }}
        >
          Upload failed: {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: '1rem', cursor: 'pointer', border: 'none', background: 'none', color: 'inherit', fontWeight: 700 }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
