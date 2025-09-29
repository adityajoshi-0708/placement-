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
  Briefcase,
  Users,
  Send,
  Eye,
  Building,
  Plus
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

export const EmployerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const myJobs = jobs.filter(job => job.employer === currentUser.company);
  const myJobIds = myJobs.map(job => job.id);
  const myApplications = applications.filter(app => myJobIds.includes(app.jobId));
  
  const totalViews = myJobs.length * 15; // Mock view count
  const newApplications = myApplications.filter(app => 
    new Date(app.appliedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Chart data
  const applicationsByJob = myJobs.map(job => ({
    jobTitle: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
    applications: myApplications.filter(app => app.jobId === job.id).length
  }));

  const applicationStatusData = [
    { name: 'Pending', value: myApplications.filter(app => app.status === 'pending_mentor').length },
    { name: 'Approved', value: myApplications.filter(app => app.status === 'approved').length },
    { name: 'Interviewed', value: myApplications.filter(app => app.status === 'interview_scheduled').length },
    { name: 'Offers', value: myApplications.filter(app => app.status === 'offer_made').length }
  ];

  const getApplicationCount = (jobId: number) => {
    return myApplications.filter(app => app.jobId === jobId).length;
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getJobStatus = (job: any) => {
    const passed = isDeadlinePassed(job.deadline);
    const applications = getApplicationCount(job.id);
    
    if (passed) return { label: 'Closed', color: 'bg-red-100 text-red-800' };
    if (applications > 0) return { label: 'Active', color: 'bg-green-100 text-green-800' };
    return { label: 'Open', color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentUser.company} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage job postings and track applications
            </p>
          </div>
          <Button 
            onClick={() => navigate('/employer/post-job')}
            className="bg-gradient-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Job Posts"
            value={myJobs.filter(job => !isDeadlinePassed(job.deadline)).length}
            description="Currently recruiting"
            icon={Briefcase}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="Total Applications"
            value={myApplications.length}
            description="All applications received"
            icon={Users}
          />
          <StatsCard
            title="Profile Views"
            value={totalViews}
            description="Job post views"
            icon={Eye}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="New This Week"
            value={newApplications}
            description="Recent applications"
            icon={Send}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Applications by Job */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Applications by Job Posting</CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsByJob.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No job postings yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationsByJob}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jobTitle" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applications" fill="hsl(210 79% 30%)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {myApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No applications received yet</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* My Job Postings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>My Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No job postings yet</p>
                    <Button 
                      onClick={() => navigate('/employer/post-job')} 
                      className="mt-4"
                    >
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  myJobs.slice(0, 3).map((job) => {
                    const status = getJobStatus(job);
                    const applications = getApplicationCount(job.id);
                    
                    return (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{applications} applications</p>
                          <p className="text-xs text-muted-foreground">
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                    );
                  })
                )}
                {myJobs.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/employer/jobs')}
                  >
                    View All ({myJobs.length})
                  </Button>
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
                  onClick={() => navigate('/employer/post-job')} 
                  className="w-full justify-start bg-gradient-primary" 
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job Opening
                </Button>
                <Button 
                  onClick={() => navigate('/employer/applications')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Applications ({myApplications.length})
                </Button>
                <Button 
                  onClick={() => navigate('/employer/jobs')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Manage Job Postings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};