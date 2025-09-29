import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

interface Application {
  id: number;
  jobId: number;
  studentName: string;
  status: 'pending_mentor' | 'approved' | 'rejected' | 'interview_scheduled';
  appliedDate: string;
}

interface Job {
  id: number;
  title: string;
  employer: string;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { Search, Filter, Eye, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';

export const EmployerApplications: React.FC = () => {
  const { applications, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add default mock data if applications/jobs are undefined
  const defaultApplications = [
    {
      id: 1,
      jobId: 1,
      studentName: "John Doe",
      status: "pending_mentor",
      appliedDate: new Date().toISOString()
    }
  ];

  const defaultJobs = [
    {
      id: 1,
      title: "Software Engineer",
      employer: "Tech Corp"
    }
  ];

  const availableApplications = applications || defaultApplications;
  const availableJobs = jobs || defaultJobs;

  // Filter applications for current employer's jobs
  const filteredApplications = availableApplications.filter(application => {
    const job = availableJobs.find(j => j.id === application.jobId);
    const matchesSearch = 
      (application.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job?.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && application.status === statusFilter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending_mentor':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            View and manage applications for your job postings
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending_mentor">Pending Mentor Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const job = jobs.find(j => j.id === application.jobId);
                return (
                  <Card key={application.id} className="bg-muted/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-lg font-semibold">{application.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{job?.title}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            </div>
                            <Badge className={getStatusBadgeColor(application.status)}>
                              {application.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {application.status === 'approved' && (
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule Interview
                            </Button>
                          )}
                          {application.status === 'pending_mentor' && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployerApplications;