import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import PatientDashboard from "@/pages/dashboard";
import IntakeFlow from "@/pages/intake";
import MyRecords from "@/pages/records";
import ProfilePage from "@/pages/profile";
import ClinicianDashboard from "@/pages/clinician";
import ClinicianQueue from "@/pages/clinician-queue";
import ClinicianReviews from "@/pages/clinician-reviews";
import AppointmentsPage from "@/pages/appointments";
import VideoCallPage from "@/pages/video-call";
import ClinicianAppointments from "@/pages/clinician-appointments";
import ChatbotPage from "@/pages/chatbot";

const queryClient = new QueryClient();

function ProtectedRoute({
  component: Component,
  roles,
}: {
  component: React.ComponentType;
  roles?: string[];
}) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-500 animate-pulse" />
          <p className="text-muted-foreground font-semibold">Loading MediKiosk...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) return <Redirect to="/" />;
  return <Component />;
}

function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-500 animate-pulse" />
      </div>
    );
  }
  if (!user) return <LandingPage />;
  return <ProtectedRoute component={PatientDashboard} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRoute} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/intake" component={() => <ProtectedRoute component={IntakeFlow} />} />
      <Route path="/records" component={() => <ProtectedRoute component={MyRecords} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/clinician" component={() => <ProtectedRoute component={ClinicianDashboard} roles={["clinician"]} />} />
      <Route path="/clinician/queue" component={() => <ProtectedRoute component={ClinicianQueue} roles={["clinician"]} />} />
      <Route path="/clinician/reviews" component={() => <ProtectedRoute component={ClinicianReviews} roles={["clinician"]} />} />
      <Route path="/clinician/summary/:sessionId" component={() => <ProtectedRoute component={ClinicianReviews} roles={["clinician"]} />} />
      <Route path="/appointments" component={() => <ProtectedRoute component={AppointmentsPage} />} />
      <Route path="/call/:roomId" component={() => <ProtectedRoute component={VideoCallPage} />} />
      <Route path="/clinician/appointments" component={() => <ProtectedRoute component={ClinicianAppointments} roles={["clinician"]} />} />
      <Route path="/chat/:type" component={() => <ProtectedRoute component={ChatbotPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
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
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
