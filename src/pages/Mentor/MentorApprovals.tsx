import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Check,
  X,
  User,
  Building,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react';

export const MentorApprovals: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs, updateApplication, addNotification } = useApp();
  const { toast } = useToast();
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  if (!currentUser) return null;

  const pendingApplications = applications.filter(app => app.status === 'pending_mentor');

  const getJobDetails = (jobId: number) => {
    return jobs.find(job => job.id === jobId);
  };

  const handleApprove = (applicationId: number, jobId: number, studentId: number) => {
    const note = notes[applicationId] || 'Application approved by mentor';
    
    updateApplication(applicationId, {
      status: 'approved',
      mentorNote: note
    });

    // Add notification for student
    addNotification({
      userId: studentId,
      message: `Your application for ${getJobDetails(jobId)?.title} has been approved`,
      type: 'success',
      read: false
    });

    toast({
      title: "Application Approved",
      description: "The student has been notified of the approval.",
    });

    // Clear the note
    setNotes(prev => ({ ...prev, [applicationId]: '' }));
  };

  const handleReject = (applicationId: number, jobId: number, studentId: number) => {
    const note = notes[applicationId] || 'Application rejected by mentor';
    
    updateApplication(applicationId, {
      status: 'rejected',
      mentorNote: note
    });

    // Add notification for student
    addNotification({
      userId: studentId,
      message: `Your application for ${getJobDetails(jobId)?.title} has been rejected`,
      type: 'error',
      read: false
    });

    toast({
      title: "Application Rejected",
      description: "The student has been notified of the rejection.",
      variant: "destructive"
    });

    // Clear the note
    setNotes(prev => ({ ...prev, [applicationId]: '' }));
  };

  const handleNoteChange = (applicationId: number, note: string) => {
    setNotes(prev => ({ ...prev, [applicationId]: note }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve student applications for internships and jobs
          </p>
        </div>

        {pendingApplications.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <Check className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No pending applications to review at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingApplications.map((application) => {
              const job = getJobDetails(application.jobId);
              if (!job) return null;

              return (
                <Card key={application.id} className="shadow-card">
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
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Job Details */}
                      <div>
                        <h4 className="font-medium mb-2">Job Description</h4>
                        <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Required Skills</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Application Details</p>
                            <div className="mt-1 space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">Applied: {application.appliedDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="text-xs">Student ID: {application.studentId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mentor Notes */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Add Review Notes (Optional)
                        </label>
                        <Textarea
                          placeholder="Add any notes about this application..."
                          value={notes[application.id] || ''}
                          onChange={(e) => handleNoteChange(application.id, e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => handleApprove(application.id, application.jobId, application.studentId)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve Application
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(application.id, application.jobId, application.studentId)}
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject Application
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};