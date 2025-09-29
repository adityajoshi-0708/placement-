import { User, Job, Application, Notification } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Aarav Gupta",
    email: "aarav@student.edu",
    role: "student",
    branch: "CSE",
    semester: 6,
    skills: ["React", "Python", "JavaScript", "Node.js"],
    resumeUrl: "/mock/resume-aarav.pdf"
  },
  {
    id: 2,
    name: "Neha Sharma",
    email: "neha@student.edu",
    role: "student",
    branch: "ECE",
    semester: 7,
    skills: ["VHDL", "Embedded Systems", "C++", "PCB Design"],
    resumeUrl: "/mock/resume-neha.pdf"
  },
  {
    id: 3,
    name: "Dr. Rajesh Kumar",
    email: "rajesh@mentor.edu",
    role: "mentor",
    branch: "CSE"
  },
  {
    id: 4,
    name: "Prof. Sunita Verma",
    email: "sunita@placement.edu",
    role: "placement_officer"
  },
  {
    id: 5,
    name: "Amit Singh",
    email: "amit@techcorp.com",
    role: "employer",
    company: "TechCorp Solutions"
  },
  {
    id: 6,
    name: "Sarah Wilson",
    email: "sarah@chipmakers.com",
    role: "employer",
    company: "ChipMakers Inc"
  }
];

export const mockJobs: Job[] = [
  {
    id: 101,
    title: "Frontend Developer Intern",
    employer: "TechCorp Solutions",
    description: "Work on cutting-edge React applications with modern technologies. You'll collaborate with senior developers to build user-friendly interfaces and learn industry best practices.",
    skills: ["React", "JavaScript", "TypeScript", "CSS"],
    stipend: "₹20,000/month",
    deadline: "2025-10-15",
    location: "Remote",
    branches: ["CSE", "IT"],
    postedDate: "2025-09-15"
  },
  {
    id: 102,
    title: "Hardware Engineer Intern",
    employer: "ChipMakers Inc",
    description: "Design and test embedded systems and PCB layouts. Gain hands-on experience with VHDL programming and hardware debugging in a state-of-the-art laboratory.",
    skills: ["VHDL", "PCB Design", "Embedded Systems", "C++"],
    stipend: "₹18,000/month",
    deadline: "2025-10-20",
    location: "Bangalore",
    branches: ["ECE", "EEE"],
    postedDate: "2025-09-20"
  },
  {
    id: 103,
    title: "Data Science Intern",
    employer: "DataFlow Analytics",
    description: "Analyze large datasets and build machine learning models. Work with Python, pandas, and scikit-learn to derive insights from real-world data.",
    skills: ["Python", "Machine Learning", "SQL", "Statistics"],
    stipend: "₹25,000/month",
    deadline: "2025-10-25",
    location: "Hybrid",
    branches: ["CSE", "IT", "Mathematics"],
    postedDate: "2025-09-22"
  },
  {
    id: 104,
    title: "Mobile App Developer",
    employer: "AppCraft Studios",
    description: "Build mobile applications for iOS and Android platforms. Learn cross-platform development using React Native and Flutter.",
    skills: ["React Native", "Flutter", "Mobile Development", "API Integration"],
    stipend: "₹22,000/month",
    deadline: "2025-11-01",
    location: "Pune",
    branches: ["CSE", "IT"],
    postedDate: "2025-09-25"
  }
];

export const mockApplications: Application[] = [
  {
    id: 1,
    jobId: 101,
    studentId: 1,
    status: "approved",
    appliedDate: "2025-09-26",
    mentorNote: "Strong technical skills and good academic record.",
    interviewDate: "2025-10-05",
    interviewTime: "10:00 AM"
  },
  {
    id: 2,
    jobId: 102,
    studentId: 2,
    status: "interview_scheduled",
    appliedDate: "2025-09-27",
    mentorNote: "Excellent hardware knowledge and practical experience.",
    interviewDate: "2025-10-07",
    interviewTime: "2:00 PM"
  },
  {
    id: 3,
    jobId: 103,
    studentId: 1,
    status: "pending_mentor",
    appliedDate: "2025-09-28"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    message: "Your application for Frontend Developer Intern has been approved by mentor",
    type: "success",
    read: false,
    createdAt: "2025-09-28T10:00:00Z"
  },
  {
    id: 2,
    userId: 1,
    message: "Interview scheduled for Frontend Developer position on Oct 5, 2025",
    type: "info",
    read: false,
    createdAt: "2025-09-28T11:00:00Z"
  },
  {
    id: 3,
    userId: 2,
    message: "New job posting matches your skills: Data Science Intern",
    type: "info",
    read: true,
    createdAt: "2025-09-27T15:30:00Z"
  }
];