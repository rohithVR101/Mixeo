/**
 * HomePage — replaces views/pages/index.ejs
 *
 * Original EJS:
 *   <h1>Welcome to the Mixeo!</h1>
 *   <h5>Where you can mix videos and share it with the world</h5>
 *   <img src="https://blush.ly/qIab1UmwU/p" alt="">
 */
function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Mixeo!</h1>
      <h5>Where you can mix videos and share it with the world</h5>
      <img
        src="https://blush.ly/qIab1UmwU/p"
        alt="Illustration of people working on videos"
      />
    </div>
  );
}

export default HomePage;
