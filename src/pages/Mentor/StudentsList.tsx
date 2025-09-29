import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const StudentsList: React.FC = () => {
  const { users } = useApp();
  
  // Filter users to get only students
  const students = users.filter(user => user.role === 'student');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            View and manage student profiles
          </p>
        </div>

        <div className="grid gap-6">
          {students.map((student) => (
            <Card key={student.id} className="shadow-card">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <Badge variant="outline" className="mt-1">
                      {student.department || 'Department Not Set'}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline">View Profile</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};