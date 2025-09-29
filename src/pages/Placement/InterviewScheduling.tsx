import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  User,
  Building,
  Check
} from 'lucide-react';

export const InterviewScheduling: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs, updateApplication, addNotification } = useApp();
  const { toast } = useToast();
  const [schedulingData, setSchedulingData] = useState<{ [key: number]: { date: string; time: string } }>({});

  if (!currentUser) return null;

  const approvedApplications = applications.filter(app => app.status === 'approved');
  const scheduledApplications = applications.filter(app => app.status === 'interview_scheduled');

  const getJobDetails = (jobId: number) => {
    return jobs.find(job => job.id === jobId);
  };

  const handleScheduleInterview = (applicationId: number, studentId: number, jobId: number) => {
    const scheduleInfo = schedulingData[applicationId];
    
    if (!scheduleInfo?.date || !scheduleInfo?.time) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the interview",
        variant: "destructive"
      });
      return;
    }

    updateApplication(applicationId, {
      status: 'interview_scheduled',
      interviewDate: scheduleInfo.date,
      interviewTime: scheduleInfo.time
    });

    // Add notification for student
    addNotification({
      userId: studentId,
      message: `Interview scheduled for ${getJobDetails(jobId)?.title} on ${new Date(scheduleInfo.date).toLocaleDateString()} at ${scheduleInfo.time}`,
      type: 'info',
      read: false
    });

    toast({
      title: "Interview Scheduled",
      description: "The student has been notified of the interview schedule.",
    });

    // Clear the scheduling data
    setSchedulingData(prev => {
      const newData = { ...prev };
      delete newData[applicationId];
      return newData;
    });
  };

  const handleScheduleChange = (applicationId: number, field: 'date' | 'time', value: string) => {
    setSchedulingData(prev => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [field]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Scheduling</h1>
          <p className="text-muted-foreground">
            Schedule interviews for approved applications
          </p>
        </div>

        {/* Approved Applications to Schedule */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Applications Ready for Interview ({approvedApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {approvedApplications.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications to Schedule</h3>
                <p className="text-muted-foreground">
                  No approved applications are waiting for interview scheduling.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {approvedApplications.map((application) => {
                  const job = getJobDetails(application.jobId);
                  if (!job) return null;

                  return (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.employer}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Student ID: {application.studentId}
                            </div>
                          </div>
                          {application.mentorNote && (
                            <p className="text-sm text-muted-foreground bg-green-50 p-2 rounded">
                              <strong>Mentor Note:</strong> {application.mentorNote}
                            </p>
                          )}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Approved
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <Label htmlFor={`date-${application.id}`}>Interview Date</Label>
                          <Input
                            id={`date-${application.id}`}
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={schedulingData[application.id]?.date || ''}
                            onChange={(e) => handleScheduleChange(application.id, 'date', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`time-${application.id}`}>Interview Time</Label>
                          <Input
                            id={`time-${application.id}`}
                            type="time"
                            value={schedulingData[application.id]?.time || ''}
                            onChange={(e) => handleScheduleChange(application.id, 'time', e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => handleScheduleInterview(application.id, application.studentId, application.jobId)}
                          className="bg-gradient-primary"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Interview
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scheduled Interviews */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Scheduled Interviews ({scheduledApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {scheduledApplications.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No interviews scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledApplications.map((application) => {
                  const job = getJobDetails(application.jobId);
                  if (!job) return null;

                  return (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                      <div className="space-y-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.employer}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>{application.interviewDate ? formatDate(application.interviewDate) : 'Date not set'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{application.interviewTime || 'Time not set'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-blue-600" />
                            <span>Student ID: {application.studentId}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Check className="mr-1 h-3 w-3" />
                        Scheduled
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};