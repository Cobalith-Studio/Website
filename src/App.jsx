import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import BeerSimulatorPage from "./pages/BeerSimulatorPage";
import ContactPage from "./pages/ContactPage";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SimulatorHubPage from "./pages/SimulatorHubPage";
import SpiritsSimulatorPage from "./pages/SpiritsSimulatorPage";
import WineDesignPage from "./pages/WineDesignPage";
import WineRecipeFinderPage from "./pages/WineRecipeFinderPage";
import WineSimulatorPage from "./pages/WineSimulatorPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/le-jeu" element={<GamePage />} />
        <Route path="/simulateur" element={<SimulatorHubPage />} />
        <Route path="/simulateur/vin" element={<WineSimulatorPage />} />
        <Route path="/simulateur/vin/concevoir" element={<WineDesignPage />} />
        <Route path="/simulateur/vin/trouver" element={<WineRecipeFinderPage />} />
        <Route path="/simulateur/biere" element={<BeerSimulatorPage />} />
        <Route path="/simulateur/spiritueux" element={<SpiritsSimulatorPage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
