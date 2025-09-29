import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Building, 
  ChartBar, 
  Target, 
  Briefcase,
  CheckCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const stats = [
    { label: 'Active Students', value: '1000+' },
    { label: 'Partner Companies', value: '50+' },
    { label: 'Successful Placements', value: '800+' },
    { label: 'Mentor Network', value: '100+' },
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Smart Job Matching',
      description: 'AI-powered job recommendations based on your skills and preferences'
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: 'Interview Preparation',
      description: 'Access to mock interviews and industry-specific preparation materials'
    },
    {
      icon: <ChartBar className="h-8 w-8" />,
      title: 'Track Progress',
      description: 'Real-time analytics and insights on your placement journey'
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Seamless Process',
      description: 'End-to-end placement management from application to offer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-foreground/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <GraduationCap className="h-20 w-20 text-primary-foreground mx-auto animate-bounce" />
          <h1 className="text-6xl font-bold text-primary-foreground bg-clip-text">
            Transform Your Career Journey
          </h1>
          <p className="text-2xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Your gateway to seamless campus placements. Connect with top employers, get mentor guidance,
            and launch your dream career.
          </p>
          
          {/* User Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm text-center space-y-3 hover:bg-white/20 transition-all">
              <GraduationCap className="h-10 w-10 text-primary-foreground mx-auto" />
              <p className="text-primary-foreground font-semibold">Students</p>
              <p className="text-primary-foreground/60 text-sm">Find & apply to dream jobs</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm text-center space-y-3 hover:bg-white/20 transition-all">
              <Users className="h-10 w-10 text-primary-foreground mx-auto" />
              <p className="text-primary-foreground font-semibold">Mentors</p>
              <p className="text-primary-foreground/60 text-sm">Guide & review applications</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm text-center space-y-3 hover:bg-white/20 transition-all">
              <Calendar className="h-10 w-10 text-primary-foreground mx-auto" />
              <p className="text-primary-foreground font-semibold">Officers</p>
              <p className="text-primary-foreground/60 text-sm">Coordinate placements</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm text-center space-y-3 hover:bg-white/20 transition-all">
              <Building className="h-10 w-10 text-primary-foreground mx-auto" />
              <p className="text-primary-foreground font-semibold">Employers</p>
              <p className="text-primary-foreground/60 text-sm">Find top talent</p>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl font-bold text-primary-foreground">{stat.value}</h3>
                <p className="text-primary-foreground/70 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="text-primary">{feature.icon}</div>
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              Start Your Journey
            </Button>
            <p className="text-muted-foreground mt-4">
              Join thousands of students who have found their dream careers through our platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
