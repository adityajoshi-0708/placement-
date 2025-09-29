import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/Dashboard/StatsCard';
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
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Briefcase,
  Users,
  CheckCircle,
  Building,
  TrendingUp
} from 'lucide-react';

const COLORS = ['hsl(210 79% 30%)', 'hsl(155 40% 35%)', 'hsl(24 88% 54%)', 'hsl(262 80% 40%)', 'hsl(190 80% 40%)'];

export const Analytics: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();

  if (!currentUser) return null;

  // Calculate statistics
  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const placedStudents = applications.filter(app => 
    app.status === 'offer_accepted'
  ).length;
  const activeInterviews = applications.filter(app => 
    app.status === 'interview_scheduled'
  ).length;

  // Monthly application trends
  const monthlyApplications = [
    { month: 'Jun', applications: 15, placements: 8 },
    { month: 'Jul', applications: 22, placements: 12 },
    { month: 'Aug', applications: 30, placements: 18 },
    { month: 'Sep', applications: totalApplications, placements: placedStudents }
  ];

  // Job category distribution
  const jobCategories = [
    { name: 'Software Development', value: 35 },
    { name: 'Data Science', value: 25 },
    { name: 'UI/UX Design', value: 15 },
    { name: 'Product Management', value: 12 },
    { name: 'DevOps', value: 13 }
  ];

  // Company wise placements
  const companyPlacements = [
    { name: 'TechCorp', placements: 12 },
    { name: 'DataFlow', placements: 8 },
    { name: 'AppCraft', placements: 6 },
    { name: 'ChipMakers', placements: 5 },
    { name: 'Others', placements: 9 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of placement statistics and trends
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Jobs Posted"
            value={totalJobs}
            description="Active job listings"
            icon={Briefcase}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            description="Applications received"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Students Placed"
            value={placedStudents}
            description="Accepted offers"
            icon={CheckCircle}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Active Interviews"
            value={activeInterviews}
            description="Scheduled interviews"
            icon={Building}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Trends */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Application & Placement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="hsl(210 79% 30%)" 
                    name="Applications"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="placements" 
                    stroke="hsl(155 40% 35%)" 
                    name="Placements"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Categories */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Job Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Company Placements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Company-wise Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyPlacements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="placements" fill="hsl(210 79% 30%)">
                  {companyPlacements.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <CardTitle>Placement Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalApplications > 0 
                  ? Math.round((placedStudents / totalApplications) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Students placed vs total applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-blue-500" />
                <CardTitle>Average Package</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹8.5L</div>
              <p className="text-xs text-muted-foreground">
                Average annual package offered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-indigo-500" />
                <CardTitle>Offer Acceptance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                Offers accepted vs total offers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};