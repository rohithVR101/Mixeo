import { useSearchParams, Link } from 'react-router-dom';

/**
 * PreviewPage — replaces views/pages/preview.ejs
 *
 * Original EJS received videoUrl via server-side template variable:
 *   <video src="<%= videoUrl %>">
 *
 * Now the trimmed Cloudinary URL is passed as a query parameter:
 *   /preview?url=https://res.cloudinary.com/...
 * and read with useSearchParams() on the client.
 */
function PreviewPage() {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get('url') || '';

  if (!videoUrl) {
    return (
      <div className="preview-page">
        <h1>Clip mixing</h1>
        <p>No video URL provided. Please trim a video in the editor first.</p>
        <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="preview-page">
      <h1>Clip mixing</h1>
      <video
        width="640"
        height="360"
        src={videoUrl}
        id="stagevideo"
        controls
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default PreviewPage;
