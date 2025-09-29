import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar,
  Filter
} from 'lucide-react';

const statusColors = {
  'pending_mentor': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
  'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
  'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  'interview_scheduled': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Interview Scheduled' },
  'offer_made': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Offer Made' },
  'offer_accepted': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Offer Accepted' },
};

export const ApplicationHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  if (!currentUser) return null;

  const getJobDetails = (jobId: number) => {
    return jobs.find(job => job.id === jobId);
  };

  const currentYear = new Date().getFullYear();
  const getApplicationMonth = (date: string) => {
    return new Date(date).getMonth();
  };

  const filteredApplications = applications.filter(app => {
    const job = getJobDetails(app.jobId);
    const matchesSearch = job && (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentId.toString().includes(searchTerm)
    );
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    const applicationMonth = getApplicationMonth(app.appliedDate);
    const matchesMonth = monthFilter === 'all' || applicationMonth.toString() === monthFilter;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application History</h1>
          <p className="text-muted-foreground">
            View and track all student applications
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by job, company, or student ID..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending_mentor">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="offer_made">Offer Made</SelectItem>
                    <SelectItem value="offer_accepted">Offer Accepted</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={monthFilter}
                  onValueChange={setMonthFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month} {currentYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No applications found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => {
                      const job = getJobDetails(app.jobId);
                      if (!job) return null;
                      const status = statusColors[app.status];

                      return (
                        <TableRow key={app.id}>
                          <TableCell>{app.studentId}</TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.employer}</TableCell>
                          <TableCell>{app.appliedDate}</TableCell>
                          <TableCell>
                            <Badge className={`${status.bg} ${status.text}`}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {app.mentorNote || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};