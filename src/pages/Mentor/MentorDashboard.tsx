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
  UserCheck,
  Clock,
  CheckCircle,
  Users,
  FileText
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

const COLORS = ['hsl(210 79% 30%)', 'hsl(155 40% 35%)', 'hsl(24 88% 54%)'];

export const MentorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const pendingApplications = applications.filter(app => app.status === 'pending_mentor');
  const approvedApplications = applications.filter(app => app.status === 'approved' || app.status === 'interview_scheduled');
  const totalApplications = applications.length;

  // Chart data
  const approvalData = [
    { name: 'Pending', value: pendingApplications.length },
    { name: 'Approved', value: approvedApplications.length },
    { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length }
  ];

  const monthlyApprovals = [
    { month: 'Jul', approvals: 0 },
    { month: 'Aug', approvals: 2 },
    { month: 'Sep', approvals: approvedApplications.length },
    { month: 'Oct', approvals: 0 }
  ];

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
          <h1 className="text-3xl font-bold tracking-tight">Mentor Dashboard</h1>
          <p className="text-muted-foreground">
            Review and approve student applications
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pending Approvals"
            value={pendingApplications.length}
            description="Awaiting your review"
            icon={Clock}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard
            title="Approved"
            value={approvedApplications.length}
            description="Applications approved"
            icon={CheckCircle}
          />
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="All applications"
            icon={FileText}
          />
          <StatsCard
            title="Success Rate"
            value={`${totalApplications > 0 ? Math.round((approvedApplications.length / totalApplications) * 100) : 0}%`}
            description="Approval percentage"
            icon={UserCheck}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Approval Status Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={approvalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {approvalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Approvals */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Approval Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyApprovals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="approvals" fill="hsl(210 79% 30%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Applications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No pending applications</p>
                  </div>
                ) : (
                  pendingApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{getJobTitle(application.jobId)}</p>
                        <p className="text-sm text-muted-foreground">{getJobCompany(application.jobId)}</p>
                        <p className="text-xs text-muted-foreground">Applied: {application.appliedDate}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    </div>
                  ))
                )}
                {pendingApplications.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/mentor/approvals')}
                  >
                    View All ({pendingApplications.length})
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
                  onClick={() => navigate('/mentor/approvals')} 
                  className="w-full justify-start bg-gradient-primary" 
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Review Applications ({pendingApplications.length})
                </Button>
                <Button 
                  onClick={() => navigate('/mentor/students')} 
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Students
                </Button>
                <Button 
                  onClick={() => navigate('/mentor/history')}
                  className="w-full justify-start" 
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Application History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};