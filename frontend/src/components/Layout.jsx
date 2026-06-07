import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout — replaces header.ejs + footer.ejs.
 * Wraps every page with the shared Navbar and Footer.
 * <Outlet /> is where the active page component is rendered.
 */
function Layout() {
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Layout;
