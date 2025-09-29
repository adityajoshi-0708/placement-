import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Users, Calendar, Building } from 'lucide-react';

const roleOptions = [
  { value: 'student', label: 'Student', icon: GraduationCap, description: 'Apply for jobs and track applications' },
  { value: 'mentor', label: 'Mentor', icon: Users, description: 'Review and approve student applications' },
  { value: 'placement_officer', label: 'Placement Officer', icon: Calendar, description: 'Schedule interviews and manage placements' },
  { value: 'employer', label: 'Employer', icon: Building, description: 'Post jobs and review candidates' }
];

const demoCredentials = {
  student: 'aarav@student.edu',
  mentor: 'rajesh@mentor.edu',
  placement_officer: 'sunita@placement.edu',
  employer: 'amit@techcorp.com'
};

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        title: "Missing Information",
        description: "Please enter email and select a role",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, role);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome to Campus Placement Portal!`,
        });
        
        // Navigate based on role
        switch (role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'mentor':
            navigate('/mentor/dashboard');
            break;
          case 'placement_officer':
            navigate('/placement/dashboard');
            break;
          case 'employer':
            navigate('/employer/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check email and role combination.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (selectedRole: string) => {
    setRole(selectedRole);
    setEmail(demoCredentials[selectedRole as keyof typeof demoCredentials]);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-primary-foreground mb-4" />
          <h1 className="text-3xl font-bold text-primary-foreground">Campus Placement Portal</h1>
          <p className="text-primary-foreground/80 mt-2">Connect students, mentors, and employers</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Login to Continue</CardTitle>
            <CardDescription>Select your role and enter credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Quick login options:</p>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(option.value)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <option.icon className="h-3 w-3" />
                    {option.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Demo credentials are auto-filled when you select a role
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};