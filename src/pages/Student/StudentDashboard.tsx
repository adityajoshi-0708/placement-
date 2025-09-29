import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['hsl(210 79% 30%)', 'hsl(155 40% 35%)', 'hsl(24 88% 54%)', 'hsl(0 84% 60%)'];

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const myApplications = applications.filter(app => app.studentId === currentUser.id);
  const approvedApplications = myApplications.filter(app => app.status === 'approved' || app.status === 'interview_scheduled');
  const pendingApplications = myApplications.filter(app => app.status === 'pending_mentor');
  const upcomingInterviews = myApplications.filter(app => app.status === 'interview_scheduled');

  // Chart data
  const applicationStatusData = [
    { name: 'Pending', value: myApplications.filter(app => app.status === 'pending_mentor').length },
    { name: 'Approved', value: myApplications.filter(app => app.status === 'approved').length },
    { name: 'Interview', value: myApplications.filter(app => app.status === 'interview_scheduled').length },
    { name: 'Offers', value: myApplications.filter(app => app.status === 'offer_made').length }
  ];

  const monthlyApplications = [
    { month: 'Aug', applications: 0 },
    { month: 'Sep', applications: myApplications.length },
    { month: 'Oct', applications: 0 }
  ];

  const getJobTitle = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Job';
  };

  const getJobCompany = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.employer || 'Unknown Company';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_mentor':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'offer_made':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending_mentor':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'offer_made':
        return 'Offer Received';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name}!</h1>
          <p className="text-muted-foreground">
            Track your applications and discover new opportunities
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Applications"
            value={myApplications.length}
            description="Applications submitted"
            icon={FileText}
            trend={{ value: 100, isPositive: true }}
          />
          <StatsCard
            title="Approved"
            value={approvedApplications.length}
            description="Mentor approved"
            icon={CheckCircle}
          />
          <StatsCard
            title="Pending"
            value={pendingApplications.length}
            description="Awaiting approval"
            icon={Clock}
          />
          <StatsCard
            title="Interviews"
            value={upcomingInterviews.length}
            description="Scheduled"
            icon={Calendar}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Application Status Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Applications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Application Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="hsl(210 79% 30%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Applications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                    <Button 
                      onClick={() => navigate('/student/jobs')} 
                      className="mt-4"
                    >
                      Browse Jobs
                    </Button>
                  </div>
                ) : (
                  myApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{getJobTitle(application.jobId)}</p>
                        <p className="text-sm text-muted-foreground">{getJobCompany(application.jobId)}</p>
                        <p className="text-xs text-muted-foreground">Applied: {application.appliedDate}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {formatStatus(application.status)}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/student/jobs')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Job Openings
                </Button>
                <Button 
                  onClick={() => navigate('/student/applications')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View All Applications
                </Button>
                <Button 
                  onClick={() => navigate('/student/profile')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};