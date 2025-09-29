import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Copy,
  Archive
} from 'lucide-react';

export const EmployerJobs: React.FC = () => {
  const { currentUser } = useAuth();
  const { jobs, applications } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!currentUser) return null;

  const employerJobs = jobs.filter(job => job.employer === currentUser.company);

  const getApplicationStats = (jobId: number) => {
    const jobApplications = applications.filter(app => app.jobId === jobId);
    return {
      total: jobApplications.length,
      approved: jobApplications.filter(app => app.status === 'approved').length,
      interviews: jobApplications.filter(app => app.status === 'interview_scheduled').length,
      offers: jobApplications.filter(app => app.status === 'offer_made' || app.status === 'offer_accepted').length
    };
  };

  const filteredJobs = employerJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isActive = new Date(job.deadline) > new Date();
    
    if (statusFilter === 'active') return matchesSearch && isActive;
    if (statusFilter === 'expired') return matchesSearch && !isActive;
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Job Postings</h1>
            <p className="text-muted-foreground">
              Manage your job postings and track applications
            </p>
          </div>
          <Button onClick={() => navigate('/employer/post-job')}>
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
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter status" />
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
                  <Card key={job.id} className="bg-card-secondary">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold">{job.title}</h3>
                              <Badge variant={isExpired ? "destructive" : "default"}>
                                {isExpired ? 'Expired' : 'Active'}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
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
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-semibold">{stats.total}</p>
                              <p className="text-xs text-muted-foreground">Applicants</p>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <CheckCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-semibold">{stats.approved}</p>
                              <p className="text-xs text-muted-foreground">Approved</p>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-semibold">{stats.interviews}</p>
                              <p className="text-xs text-muted-foreground">Interviews</p>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                              <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-2xl font-semibold">{stats.offers}</p>
                              <p className="text-xs text-muted-foreground">Offers</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              className="justify-start"
                              onClick={() => navigate(`/employer/applications/${job.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Applications
                            </Button>
                            <Button 
                              variant="outline" 
                              className="justify-start"
                              onClick={() => navigate(`/employer/edit-job/${job.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Posting
                            </Button>
                            <Button 
                              variant="outline" 
                              className="justify-start"
                              onClick={() => {/* Implement duplicate */}}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </Button>
                            <Button 
                              variant="outline" 
                              className="justify-start text-destructive"
                              onClick={() => {/* Implement archive */}}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
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
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No jobs found</p>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "Try adjusting your search terms"
                      : "Get started by posting your first job"
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      className="mt-4"
                      onClick={() => navigate('/employer/post-job')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};