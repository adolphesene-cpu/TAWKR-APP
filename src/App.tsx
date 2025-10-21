import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import DashboardAdmin from "@/components/DashboardAdmin";
import DashboardFranchise from "@/components/DashboardFranchise";
import Login from "@/pages/Login";
import Franchises from "@/pages/Franchises";
import Campagnes from "@/pages/Campagnes";
import Territoires from "@/pages/Territoires";
import Villes from "@/pages/Villes";
import Clients from "@/pages/Clients";
import Utilisateurs from "@/pages/Utilisateurs";
import Profils from "@/pages/Profils"; // Import Profils component
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ImportData from "./pages/ImportData"; // Import ImportData component
import CampaignValidationOverview from "./pages/CampaignValidationOverview"; // Import CampaignValidationOverview component

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && <Navbar />}
      <main className="flex-1 p-8 pt-20 md:pt-8 lg:ml-64">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {user?.profil_us === "admin" && <DashboardAdmin />}
                {user?.profil_us === "franchise" && <DashboardFranchise />}
              </ProtectedRoute>
            }
          />
      <Route
        path="/franchises"
        element={
          <ProtectedRoute adminOnly>
            <Franchises />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campagnes"
        element={
          <ProtectedRoute>
            <Campagnes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/territoires"
        element={
          <ProtectedRoute>
            <Territoires />
          </ProtectedRoute>
        }
      />
      <Route
        path="/villes"
        element={
          <ProtectedRoute adminOnly>
            <Villes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/utilisateurs"
        element={
          <ProtectedRoute adminOnly>
            <Utilisateurs />
          </ProtectedRoute>
        }
          />
          <Route
        path="/profils"
        element={
          <ProtectedRoute adminOnly>
            <Profils />
          </ProtectedRoute>
        }
      />
          <Route
        path="/import-data"
        element={
          <ProtectedRoute adminOnly>
            <ImportData />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaign-validation-overview"
        element={
          <ProtectedRoute adminOnly>
            <CampaignValidationOverview />
          </ProtectedRoute>
        }
      />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider> {/* DataProvider should wrap AuthProvider */}
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
