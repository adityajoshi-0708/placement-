import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building, Clock, CheckCircle, FileText, Download } from 'lucide-react';

export const StudentApplications: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, jobs } = useApp();

  if (!currentUser) return null;

  const myApplications = applications.filter(app => app.studentId === currentUser.id);

  const getJobDetails = (jobId: number) => {
    return jobs.find(job => job.id === jobId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_mentor':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'offer_made':
        return 'bg-purple-100 text-purple-800';
      case 'offer_accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending_mentor':
        return 'Pending Mentor Approval';
      case 'approved':
        return 'Approved by Mentor';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'offer_made':
        return 'Offer Received';
      case 'offer_accepted':
        return 'Offer Accepted';
      case 'rejected':
        return 'Application Rejected';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending_mentor':
        return <Clock className="h-4 w-4" />;
      case 'interview_scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'offer_made':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const downloadICS = (application: any) => {
    if (!application.interviewDate || !application.interviewTime) return;
    
    const job = getJobDetails(application.jobId);
    const startDate = new Date(`${application.interviewDate}T${application.interviewTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Campus Placement Portal//Interview//EN
BEGIN:VEVENT
UID:interview-${application.id}@placement.edu
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Interview - ${job?.title}
DESCRIPTION:Interview for ${job?.title} position at ${job?.employer}
LOCATION:Campus Interview Room
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${job?.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        {myApplications.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't applied for any jobs yet. Start exploring opportunities!
              </p>
              <Button onClick={() => window.location.href = '/student/jobs'}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myApplications.map((application) => {
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
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {formatStatus(application.status)}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">Applied Date</p>
                          <p>{new Date(application.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Stipend</p>
                          <p>{job.stipend}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Deadline</p>
                          <p>{new Date(job.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {application.mentorNote && (
                        <div className="border-l-4 border-primary pl-4">
                          <p className="font-medium text-sm">Mentor Note:</p>
                          <p className="text-sm text-muted-foreground">{application.mentorNote}</p>
                        </div>
                      )}

                      {application.status === 'interview_scheduled' && application.interviewDate && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Interview Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span>Date: {new Date(application.interviewDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>Time: {application.interviewTime}</span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => downloadICS(application)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Add to Calendar
                          </Button>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
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