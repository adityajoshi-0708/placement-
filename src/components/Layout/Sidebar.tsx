import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Briefcase,
  Calendar,
  FileText,
  Home,
  Send,
  Users,
  UserCheck,
  Building,
  Clock
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const getNavigationItems = (role: string): NavItem[] => {
  const baseItems: NavItem[] = [
    { title: 'Dashboard', href: `/${role}/dashboard`, icon: Home }
  ];

  switch (role) {
    case 'student':
      return [
        ...baseItems,
        { title: 'Job Listings', href: '/student/jobs', icon: Briefcase },
        { title: 'My Applications', href: '/student/applications', icon: FileText },
        { title: 'Profile', href: '/student/profile', icon: Users }
      ];
    case 'mentor':
      return [
        ...baseItems,
        { title: 'Pending Approvals', href: '/mentor/approvals', icon: UserCheck },
        { title: 'Students', href: '/mentor/students', icon: Users }
      ];
    case 'placement_officer':
      return [
        ...baseItems,
        { title: 'Interview Scheduling', href: '/placement/interviews', icon: Calendar },
        { title: 'Job Management', href: '/placement/jobs', icon: Briefcase },
        { title: 'Analytics', href: '/placement/analytics', icon: BarChart3 }
      ];
    case 'employer':
      return [
        ...baseItems,
        { title: 'Post Job', href: '/employer/post-job', icon: Send },
        { title: 'My Jobs', href: '/employer/jobs', icon: Building },
        { title: 'Applications', href: '/employer/applications', icon: FileText }
      ];
    default:
      return baseItems;
  }
};

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const navigationItems = getNavigationItems(currentUser.role);

  return (
    <div className="w-64 bg-card border-r shadow-sm">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};