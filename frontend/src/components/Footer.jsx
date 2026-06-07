/**
 * Footer — replaces footer.ejs.
 * The old footer also loaded jQuery, Bootstrap JS, and rangePlayer.js via
 * <script> tags. Those scripts no longer exist — Vite bundles everything.
 */
function Footer() {
  return (
    <footer className="site-footer">
      Made by{' '}
      <a
        href="https://www.linkedin.com/in/rohithvr101/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Rohith Adithya RV
      </a>
    </footer>
  );
}

export default Footer;
