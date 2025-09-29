import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  GraduationCap,
  Code,
  FileText,
  Activity,
  MapPin,
  Mail,
  Building
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const StudentProfile: React.FC<{ studentId: number }> = ({ studentId }) => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();

  if (!currentUser) return null;

  const studentApplications = applications.filter(app => app.studentId === studentId);
  const studentApprovalRate = studentApplications.length > 0
    ? (studentApplications.filter(app => app.status === 'approved' || app.status === 'interview_scheduled' || app.status === 'offer_made' || app.status === 'offer_accepted').length / studentApplications.length * 100).toFixed(1)
    : 0;

  const applicationsByMonth = [
    { month: 'Jul', applications: 0 },
    { month: 'Aug', applications: 2 },
    { month: 'Sep', applications: studentApplications.length },
    { month: 'Oct', applications: 0 }
  ];

  const mockStudentData = {
    name: "Aarav Gupta",
    email: "aarav@student.edu",
    branch: "Computer Science",
    semester: 6,
    cgpa: 8.7,
    skills: ["React", "Python", "JavaScript", "Node.js", "TypeScript", "SQL"],
    location: "Bangalore",
    interests: ["Web Development", "Machine Learning", "Cloud Computing"],
    resume: "/path/to/resume.pdf"
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
          <p className="text-muted-foreground">
            View detailed student information and application history
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{mockStudentData.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1" />
                      {mockStudentData.email}
                    </div>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {mockStudentData.location}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {mockStudentData.branch}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Semester</p>
                    <p className="font-medium">{mockStudentData.semester}th Semester</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CGPA</p>
                    <p className="font-medium">{mockStudentData.cgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="font-medium">{studentApplications.length} Total</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Code className="h-4 w-4 mr-1" />
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mockStudentData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    Areas of Interest
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mockStudentData.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application History */}
          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Application History</CardTitle>
                <Badge variant="secondary" className="ml-2">
                  {studentApprovalRate}% Success Rate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={applicationsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="hsl(210 79% 30%)" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {studentApplications.map((app) => {
                    const job = jobs.find(j => j.id === app.jobId);
                    if (!job) return null;

                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Building className="h-5 w-5 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.employer}</p>
                            <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={
                              app.status === 'approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              app.status === 'pending_mentor' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }
                          >
                            {app.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {app.mentorNote && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Note: {app.mentorNote}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};