import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import Login from "@/pages/Login";
import Franchises from "@/pages/Franchises";
import Campagnes from "@/pages/Campagnes";
import Territoires from "@/pages/Territoires";
import Villes from "@/pages/Villes";
import Clients from "@/pages/Clients";
import Utilisateurs from "@/pages/Utilisateurs";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ImportData from "./pages/ImportData"; // Import ImportData component
import CampaignValidationOverview from "./pages/CampaignValidationOverview"; // Import CampaignValidationOverview component

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
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
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
