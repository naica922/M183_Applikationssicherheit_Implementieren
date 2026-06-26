import Navbar from './Navbar.jsx';

// Shared shell for authenticated pages: navbar on top, page content below.
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page">{children}</main>
    </>
  );
}
