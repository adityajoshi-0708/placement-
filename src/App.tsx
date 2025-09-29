import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { AuthRedirect } from "@/components/AuthRedirect";
import { Login } from "@/components/Login";
import { StudentDashboard } from "@/pages/Student/StudentDashboard";
import { JobListings } from "@/pages/Student/JobListings";
import { StudentApplications } from "@/pages/Student/StudentApplications";
import { StudentProfile } from "@/pages/Student/StudentProfile";
import { MentorDashboard } from "@/pages/Mentor/MentorDashboard";
import { MentorApprovals } from "@/pages/Mentor/MentorApprovals";
import { StudentsList } from "@/pages/Mentor/StudentsList";
import { ApplicationHistory } from "@/pages/Mentor/ApplicationHistory";
import { PlacementDashboard } from "@/pages/Placement/PlacementDashboard";
import { InterviewScheduling } from "@/pages/Placement/InterviewScheduling";
import { JobManagement } from "@/pages/Placement/JobManagement";
import { Analytics } from "@/pages/Placement/Analytics";
import { EmployerDashboard } from "@/pages/Employer/EmployerDashboard";
import { PostJob } from "@/pages/Employer/PostJob";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/login" element={<Login />} />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/jobs" element={<JobListings />} />
              <Route path="/student/applications" element={<StudentApplications />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              
              {/* Mentor Routes */}
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              <Route path="/mentor/approvals" element={<MentorApprovals />} />
              <Route path="/mentor/students" element={<StudentsList />} />
              <Route path="/mentor/history" element={<ApplicationHistory />} />
              
              {/* Placement Officer Routes */}
              <Route path="/placement/dashboard" element={<PlacementDashboard />} />
              <Route path="/placement/interviews" element={<InterviewScheduling />} />
              <Route path="/placement/jobs" element={<JobManagement />} />
              <Route path="/placement/analytics" element={<Analytics />} />
              
              {/* Employer Routes */}
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/post-job" element={<PostJob />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
