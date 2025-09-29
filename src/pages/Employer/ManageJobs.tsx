import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

interface ExtendedJob extends AppJob {
  status?: 'active' | 'closed' | 'draft';
  branches: string[];
}

// Helper function to get badge color based on status
const getStatusBadgeColor = (status?: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Job as AppJob } from '@/types';
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
  Clock
} from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const { jobs } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDeleteJob = (jobId: number) => {
    toast({
      title: "Job Deleted",
      description: "The job posting has been removed successfully.",
      variant: "destructive"
    });
  };

  const handleUpdateStatus = (jobId: number, status: string) => {
    toast({
      title: "Status Updated",
      description: `Job status has been updated to ${status}.`
    });
  };

  // Add default mock data if jobs is undefined
  const defaultJobs: ExtendedJob[] = [
    {
      id: 1,
      title: "Software Engineer",
      employer: "Tech Corp",
      location: "Mumbai",
      description: "Looking for software engineers",
      stipend: "15-20 LPA",
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      skills: ["React", "Node.js", "TypeScript"],
      branches: ["Computer Science", "Information Technology"]
    }
  ];

  const availableJobs: ExtendedJob[] = (jobs as ExtendedJob[]) || defaultJobs;
  
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = 
      (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && (job.status || 'draft') === statusFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
            <p className="text-muted-foreground">
              Create and manage your job postings
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building className="h-4 w-4 mr-1" />
                            {job.employer}
                          </div>
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
                            Posted: {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
                          {(job.status || 'DRAFT').toUpperCase()}
                        </Badge>

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
                                <h2 className="text-xl font-semibold">{job.title}</h2>
                                <p className="text-muted-foreground">{job.description}</p>
                                {/* Add more job details here */}
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
                            className="text-red-600"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>

                          {(job.status || 'draft') !== 'closed' && (
                            <Select onValueChange={(value) => handleUpdateStatus(job.id, value)}>
                              <SelectTrigger className="w-[100px] h-9">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="closed">Close</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

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

export default ManageJobs;