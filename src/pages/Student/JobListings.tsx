import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Search,
  Filter
} from 'lucide-react';

export const JobListings: React.FC = () => {
  const { currentUser } = useAuth();
  const { jobs, applications, addApplication, addNotification } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentUser) return null;

  const myApplications = applications.filter(app => app.studentId === currentUser.id);
  const appliedJobIds = new Set(myApplications.map(app => app.jobId));

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBranch = currentUser.branch ? job.branches.includes(currentUser.branch) : true;
    
    return matchesSearch && matchesBranch;
  });

  const handleApply = (jobId: number) => {
    if (appliedJobIds.has(jobId)) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this position",
        variant: "destructive"
      });
      return;
    }

    // Add application
    addApplication({
      jobId,
      studentId: currentUser.id,
      status: 'pending_mentor'
    });

    // Add notification
    addNotification({
      userId: currentUser.id,
      message: `Application submitted for ${jobs.find(j => j.id === jobId)?.title}`,
      type: 'success',
      read: false
    });

    toast({
      title: "Application Submitted",
      description: "Your application has been sent for mentor approval",
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
          <p className="text-muted-foreground">
            Discover internships and job openings that match your skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Job Cards */}
        <div className="grid gap-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No jobs found matching your criteria</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const hasApplied = appliedJobIds.has(job.id);
              const deadlinePassed = isDeadlinePassed(job.deadline);
              
              return (
                <Card key={job.id} className="shadow-card hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {job.employer}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.stipend}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </div>
                        {deadlinePassed && (
                          <Badge variant="destructive">Deadline Passed</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Eligible Branches:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.branches.map((branch) => (
                            <Badge 
                              key={branch} 
                              variant={currentUser.branch === branch ? "default" : "outline"}
                            >
                              {branch}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <p className="text-xs text-muted-foreground">
                          Posted: {new Date(job.postedDate).toLocaleDateString()}
                        </p>
                        <Button 
                          onClick={() => handleApply(job.id)}
                          disabled={hasApplied || deadlinePassed}
                          className="bg-gradient-primary"
                        >
                          {hasApplied ? 'Applied' : deadlinePassed ? 'Deadline Passed' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};