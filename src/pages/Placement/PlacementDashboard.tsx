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
  Calendar,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['hsl(210 79% 30%)', 'hsl(155 40% 35%)', 'hsl(24 88% 54%)', 'hsl(0 84% 60%)'];

export const PlacementDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const scheduledInterviews = applications.filter(app => app.status === 'interview_scheduled');
  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const offersGiven = applications.filter(app => app.status === 'offer_made').length;

  // Chart data
  const placementData = [
    { name: 'Jobs Posted', value: totalJobs },
    { name: 'Applications', value: totalApplications },
    { name: 'Interviews', value: scheduledInterviews.length },
    { name: 'Offers', value: offersGiven }
  ];

  const monthlyData = [
    { month: 'Jul', jobs: 0, applications: 0, interviews: 0 },
    { month: 'Aug', jobs: 1, applications: 1, interviews: 0 },
    { month: 'Sep', jobs: totalJobs, applications: totalApplications, interviews: scheduledInterviews.length },
    { month: 'Oct', jobs: 0, applications: 0, interviews: 0 }
  ];

  const companyData = jobs.reduce((acc: any[], job) => {
    const existing = acc.find(item => item.company === job.employer);
    if (existing) {
      existing.applications += applications.filter(app => app.jobId === job.id).length;
    } else {
      acc.push({
        company: job.employer,
        applications: applications.filter(app => app.jobId === job.id).length
      });
    }
    return acc;
  }, []);

  const getJobTitle = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Job';
  };

  const getJobCompany = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.employer || 'Unknown Company';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Dashboard</h1>
          <p className="text-muted-foreground">
            Manage interviews, track placements, and analyze recruitment data
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Job Postings"
            value={totalJobs}
            description="Active positions"
            icon={Briefcase}
            trend={{ value: 33, isPositive: true }}
          />
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="All applications"
            icon={Users}
          />
          <StatsCard
            title="Interviews Scheduled"
            value={scheduledInterviews.length}
            description="Upcoming interviews"
            icon={Calendar}
          />
          <StatsCard
            title="Offers Made"
            value={offersGiven}
            description="Job offers extended"
            icon={CheckCircle}
            trend={{ value: 100, isPositive: true }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Placement Pipeline */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Placement Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={placementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(210 79% 30%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Placement Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="jobs" stroke="hsl(210 79% 30%)" name="Jobs" />
                  <Line type="monotone" dataKey="applications" stroke="hsl(155 40% 35%)" name="Applications" />
                  <Line type="monotone" dataKey="interviews" stroke="hsl(24 88% 54%)" name="Interviews" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Interviews */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No interviews scheduled</p>
                    <Button 
                      onClick={() => navigate('/placement/interviews')} 
                      className="mt-4"
                    >
                      Schedule Interviews
                    </Button>
                  </div>
                ) : (
                  scheduledInterviews.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{getJobTitle(application.jobId)}</p>
                        <p className="text-sm text-muted-foreground">{getJobCompany(application.jobId)}</p>
                        <p className="text-xs text-muted-foreground">
                          {application.interviewDate} at {application.interviewTime}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Scheduled
                      </Badge>
                    </div>
                  ))
                )}
                {scheduledInterviews.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/placement/interviews')}
                  >
                    View All ({scheduledInterviews.length})
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
                  onClick={() => navigate('/placement/interviews')} 
                  className="w-full justify-start bg-gradient-primary" 
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interviews ({applications.filter(app => app.status === 'approved').length})
                </Button>
                <Button 
                  onClick={() => navigate('/placement/jobs')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Manage Job Postings
                </Button>
                <Button 
                  onClick={() => navigate('/placement/analytics')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Building className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Applications */}
        {companyData.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Applications by Company</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="company" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="hsl(155 40% 35%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};