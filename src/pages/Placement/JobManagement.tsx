import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';

export const JobManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { jobs, applications } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  if (!currentUser) return null;

  const handleDeleteJob = (jobId: number) => {
    // In a real app, this would delete the job
    toast({
      title: "Job Deleted",
      description: "The job posting has been removed.",
      variant: "destructive"
    });
  };

  const getApplicationStats = (jobId: number) => {
    const jobApplications = applications.filter(app => app.jobId === jobId);
    return {
      total: jobApplications.length,
      pending: jobApplications.filter(app => app.status === 'pending_mentor').length,
      approved: jobApplications.filter(app => ['approved', 'interview_scheduled', 'offer_made', 'offer_accepted'].includes(app.status)).length,
      interviews: jobApplications.filter(app => app.status === 'interview_scheduled').length
    };
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const deadline = new Date(job.deadline);
    const isActive = deadline > now;

    if (filterBy === 'active') return matchesSearch && isActive;
    if (filterBy === 'expired') return matchesSearch && !isActive;
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor all job postings
            </p>
          </div>
          <Button onClick={() => {/* Implement new job creation */}}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={filterBy}
                  onValueChange={setFilterBy}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const stats = getApplicationStats(job.id);
                const isExpired = new Date(job.deadline) < new Date();

                return (
                  <Card key={job.id} className="bg-muted/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building className="h-4 w-4 mr-1" />
                                {job.employer}
                              </div>
                            </div>
                            <Badge variant="outline" className={isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {isExpired ? 'Expired' : 'Active'}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.stipend}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Deadline: {job.deadline}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Applications</p>
                              <p className="font-medium">{stats.total}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Pending Review</p>
                              <p className="font-medium">{stats.pending}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Approved</p>
                              <p className="font-medium">{stats.approved}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Interviews</p>
                              <p className="font-medium">{stats.interviews}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Job Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {/* Job details content */}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No jobs found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};