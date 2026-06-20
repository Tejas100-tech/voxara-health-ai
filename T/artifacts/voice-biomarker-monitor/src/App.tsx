import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import DoctorLoginPage from "@/pages/doctor-login";
import SignupPage from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import RecordSession from "@/pages/record";
import Analysis from "@/pages/analysis";
import Trends from "@/pages/trends";
import ClinicianOverview from "@/pages/clinician";
import AlertsHistory from "@/pages/alerts";
import MedicationWorkflow from "@/pages/medication";
import HistoryPage from "@/pages/history";
import PatientDetailPage from "@/pages/patient-detail";
import AppointmentsPage from "@/pages/appointments";
import VideoCallPage from "@/pages/video-call";
import MLDashboard from "@/pages/ml-dashboard";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, roles }: { component: React.ComponentType; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-pulse" />
          <p className="text-muted-foreground font-semibold">Loading Voxara...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) return <Redirect to="/" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/doctor-login" component={DoctorLoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/record" component={() => <ProtectedRoute component={RecordSession} />} />
      <Route path="/analysis" component={() => <ProtectedRoute component={Analysis} />} />
      <Route path="/trends" component={() => <ProtectedRoute component={Trends} />} />
      <Route path="/history" component={() => <ProtectedRoute component={HistoryPage} />} />
      <Route path="/appointments" component={() => <ProtectedRoute component={AppointmentsPage} />} />
      <Route path="/call/:id" component={() => <ProtectedRoute component={VideoCallPage} />} />
      <Route path="/ml" component={() => <ProtectedRoute component={MLDashboard} />} />
      <Route path="/clinician" component={() => <ProtectedRoute component={ClinicianOverview} roles={["clinician"]} />} />
      <Route path="/clinician/patient/:patientId" component={() => <ProtectedRoute component={PatientDetailPage} roles={["clinician"]} />} />
      <Route path="/alerts" component={() => <ProtectedRoute component={AlertsHistory} />} />
      <Route path="/medication" component={() => <ProtectedRoute component={MedicationWorkflow} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
