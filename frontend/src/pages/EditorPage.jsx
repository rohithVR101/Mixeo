import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import RangePlayer from '../components/RangePlayer/RangePlayer';
import { stageVideo } from '../services/api';

/**
 * Formats a duration (seconds) as HH:MM:SS.
 * Migrated from the setDuration() helper in rangePlayer.js.
 */
function formatDuration(secs) {
  const sec_num = parseInt(secs || 0, 10);
  const hours = String(Math.floor(sec_num / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((sec_num % 3600) / 60)).padStart(2, '0');
  const seconds = String(sec_num % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * EditorPage — replaces views/pages/new.ejs + public/js/script.js.
 *
 * Video metadata (publicId, secureUrl, duration) is received via
 * React Router location.state, which Navbar sets after a successful upload.
 *
 * The trimRange state ({start, end}) is lifted here so that the CUT button
 * can read the current selection without the global vidProp leak that
 * existed in the original jQuery implementation.
 */
function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoData = location.state;

  const [trimRange, setTrimRange] = useState({ start: 0.01, end: videoData?.duration || 0 });
  const [cutting, setCutting] = useState(false);
  const [cutError, setCutError] = useState(null);

  // Guard: if the user navigates here directly without uploading, show a prompt
  if (!videoData || !videoData.publicId || !videoData.secureUrl) {
    return (
      <div className="editor-page">
        <h1>No video loaded</h1>
        <p style={{ marginTop: '1rem' }}>
          Please upload a video first using the &quot;CREATE A NEW VIDEO&quot; button in the navbar.
        </p>
        <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  const { publicId, secureUrl, duration } = videoData;

  const handleCut = async () => {
    setCutError(null);
    setCutting(true);
    try {
      const data = await stageVideo(publicId, trimRange.start, trimRange.end);
      navigate('/preview?url=' + encodeURIComponent(data.trimmedUrl));
    } catch (err) {
      setCutError(err.message);
      setCutting(false);
    }
  };

  return (
    <div className="editor-page">
      <h1>Prepare video</h1>
      <h5 id="vname">Selected clip</h5>

      {/* RangePlayer replaces new.ejs video element + rangePlayer.js entirely */}
      <RangePlayer
        src={secureUrl}
        duration={duration}
        onRangeChange={setTrimRange}
      />

      <form className="options" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="totaldur">
          Total video length:
          <input
            type="text"
            id="totaldur"
            name="totaldur"
            value={formatDuration(duration)}
            readOnly
          />
        </label>

        <label htmlFor="selectdur">
          Duration selected:
          <input
            type="text"
            id="selectdur"
            name="selectdur"
            value={formatDuration(trimRange.end - trimRange.start)}
            readOnly
          />
        </label>

        <button
          id="cut"
          className="btn-cut"
          type="button"
          onClick={handleCut}
          disabled={cutting}
        >
          {cutting ? 'PROCESSING...' : 'CUT'}
        </button>
      </form>

      {cutError && (
        <p role="alert" style={{ color: '#842029', marginTop: '0.75rem' }}>
          Error: {cutError}
        </p>
      )}
    </div>
  );
}

export default EditorPage;
