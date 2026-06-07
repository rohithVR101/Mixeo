/**
 * CommunityPage — replaces views/pages/community.ejs
 *
 * Original layout: Bootstrap two-column grid with a YouTube iframe
 * and a Blush illustration. Reproduced with custom CSS classes.
 */
function CommunityPage() {
  return (
    <div className="community-page">
      <div className="row">
        <div className="col-6">
          <h1>The Mixeo Community</h1>
          <h5>Find what others are upto with Mixeo</h5>
          <div className="featured-video shadow">
            <p>Featured Video</p>
            <iframe
              src="https://www.youtube.com/embed/J6bY8rJ-e6A?autoplay=1&mute=1&modestbranding=1&loop=1&controls=0"
              frameBorder="0"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Mixeo Community Featured Video"
            />
          </div>
        </div>
        <div className="col-6">
          <img
            className="banner"
            src="https://blush.ly/6vk_MQpkB/p"
            alt="Community illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
