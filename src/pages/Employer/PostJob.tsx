import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react';

const availableBranches = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Mathematics'];
const commonSkills = [
  'React', 'JavaScript', 'Python', 'Java', 'Node.js', 'TypeScript',
  'HTML/CSS', 'SQL', 'Git', 'VHDL', 'PCB Design', 'Embedded Systems',
  'C++', 'C', 'Machine Learning', 'Data Science', 'Flutter', 'React Native'
];

export const PostJob: React.FC = () => {
  const { currentUser } = useAuth();
  const { addJob } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [] as string[],
    stipend: '',
    location: '',
    deadline: '',
    branches: [] as string[]
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser || !currentUser.company) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleBranchChange = (branch: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      branches: checked 
        ? [...prev.branches, branch]
        : prev.branches.filter(b => b !== branch)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.stipend || 
        !formData.location || !formData.deadline || formData.branches.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.skills.length === 0) {
      toast({
        title: "Skills Required",
        description: "Please add at least one required skill",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addJob({
        title: formData.title,
        employer: currentUser.company,
        description: formData.description,
        skills: formData.skills,
        stipend: formData.stipend,
        deadline: formData.deadline,
        location: formData.location,
        branches: formData.branches
      });

      toast({
        title: "Job Posted Successfully",
        description: "Your job posting is now live and students can apply",
      });

      navigate('/employer/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post New Job</h1>
          <p className="text-muted-foreground">
            Create a new job posting to attract talented students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Frontend Developer Intern"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={currentUser.company}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Remote, Bangalore, Hybrid"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stipend">Stipend *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="stipend"
                      value={formData.stipend}
                      onChange={(e) => handleInputChange('stipend', e.target.value)}
                      placeholder="e.g., ₹20,000/month"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Application Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what the candidate will learn..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills and Requirements */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Skills & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Required Skills *</Label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a required skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
                    />
                    <Button 
                      type="button" 
                      onClick={() => addSkill(newSkill)} 
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Quick add common skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonSkills.filter(skill => !formData.skills.includes(skill)).map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSkill(skill)}
                          className="text-xs"
                        >
                          + {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Eligible Branches *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select which academic branches are eligible for this position
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableBranches.map((branch) => (
                    <div key={branch} className="flex items-center space-x-2">
                      <Checkbox
                        id={`branch-${branch}`}
                        checked={formData.branches.includes(branch)}
                        onCheckedChange={(checked) => handleBranchChange(branch, checked as boolean)}
                      />
                      <Label htmlFor={`branch-${branch}`} className="text-sm">
                        {branch}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{formData.title || 'Job Title'}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {currentUser.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formData.location || 'Location'}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formData.stipend || 'Stipend'}
                  </div>
                </div>
                <p className="text-sm">{formData.description || 'Job description will appear here...'}</p>
                {formData.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {formData.branches.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Eligible Branches:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.branches.map((branch) => (
                        <Badge key={branch} variant="outline" className="text-xs">{branch}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/employer/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary"
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};