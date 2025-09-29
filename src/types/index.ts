export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'placement_officer' | 'employer';
  branch?: string;
  semester?: number;
  skills?: string[];
  resumeUrl?: string;
  company?: string;
}

export interface Job {
  id: number;
  title: string;
  employer: string;
  description: string;
  skills: string[];
  stipend: string;
  deadline: string;
  location: string;
  branches: string[];
  postedDate: string;
}

export interface Application {
  id: number;
  jobId: number;
  studentId: number;
  status: 'pending_mentor' | 'approved' | 'rejected' | 'interview_scheduled' | 'offer_made' | 'offer_accepted';
  appliedDate: string;
  mentorNote?: string;
  interviewDate?: string;
  interviewTime?: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalApplications?: number;
  approvedApplications?: number;
  pendingApprovals?: number;
  jobPostings?: number;
  interviewsScheduled?: number;
  offers?: number;
}