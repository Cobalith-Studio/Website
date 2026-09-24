import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SiteLayout from "./components/layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNotes from "./pages/admin/AdminNotes";
import AssetManager from "./pages/admin/AssetManager";
import Budget from "./pages/admin/Budget";
import KanbanBoard from "./pages/admin/KanbanBoard";
import BeerSimulatorPage from "./pages/BeerSimulatorPage";
import ContactPage from "./pages/ContactPage";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import SimulatorHubPage from "./pages/SimulatorHubPage";
import SpiritsSimulatorPage from "./pages/SpiritsSimulatorPage";
import WineDesignPage from "./pages/WineDesignPage";
import WineRecipeFinderPage from "./pages/WineRecipeFinderPage";
import WineSimulatorPage from "./pages/WineSimulatorPage";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
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
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
        </Route>
        <Route
          path="/equipe"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipe/assets"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AssetManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipe/notes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipe/kanban"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <KanbanBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipe/budget"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Budget />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/equipe" replace />} />
        <Route path="/admin/assets" element={<Navigate to="/equipe/assets" replace />} />
        <Route path="/admin/notes" element={<Navigate to="/equipe/notes" replace />} />
        <Route path="/admin/kanban" element={<Navigate to="/equipe/kanban" replace />} />
        <Route path="/admin/budget" element={<Navigate to="/equipe/budget" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}
