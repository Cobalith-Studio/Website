import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import SiteHeader from "./SiteHeader";

export default function SiteLayout() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
