import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, GraduationCap, LogOut, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;
  const userNotifications = notifications.filter(n => n.userId === currentUser.id).slice(0, 5);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      'student': 'Student',
      'mentor': 'Mentor',
      'placement_officer': 'Placement Officer',
      'employer': 'Employer'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <nav className="border-b bg-card shadow-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-primary">Campus Placement Portal</h1>
              <p className="text-xs text-muted-foreground">{getRoleDisplayName(currentUser.role)} Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Notifications */}
            <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  {userNotifications.length === 0 ? (
                    <p className="text-muted-foreground">No notifications yet</p>
                  ) : (
                    <div className="space-y-3">
                      {userNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 rounded-lg border ${!notification.read ? 'bg-accent/20' : 'bg-muted/20'}`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getRoleDisplayName(currentUser.role)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};