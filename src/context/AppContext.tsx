import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Application, Notification } from '@/types';
import { mockJobs, mockApplications, mockNotifications } from '@/data/mockData';

interface AppContextType {
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  addApplication: (application: Omit<Application, 'id' | 'appliedDate'>) => void;
  updateApplication: (id: number, updates: Partial<Application>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedJobs = localStorage.getItem('placementJobs');
    const storedApplications = localStorage.getItem('placementApplications');
    const storedNotifications = localStorage.getItem('placementNotifications');

    if (storedJobs) setJobs(JSON.parse(storedJobs));
    if (storedApplications) setApplications(JSON.parse(storedApplications));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('placementJobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('placementApplications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('placementNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...jobData,
      id: Math.max(...jobs.map(j => j.id)) + 1,
      postedDate: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [...prev, newJob]);
  };

  const addApplication = (appData: Omit<Application, 'id' | 'appliedDate'>) => {
    const newApplication: Application = {
      ...appData,
      id: Math.max(...applications.map(a => a.id)) + 1,
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplication = (id: number, updates: Partial<Application>) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...updates } : app)
    );
  };

  const addNotification = (notifData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notifData,
      id: Math.max(...notifications.map(n => n.id)) + 1,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const value = {
    jobs,
    applications,
    notifications,
    addJob,
    addApplication,
    updateApplication,
    addNotification,
    markNotificationAsRead
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};