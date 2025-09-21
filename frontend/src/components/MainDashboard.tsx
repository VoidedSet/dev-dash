import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { ProjectsView } from './ProjectsView';
import { ActionItems } from './ActionItems';
import { User, Repository, PullRequest, Issue } from '../App';

interface MainDashboardProps {
  user: User;
  repositories: Repository[]; 
  onLogout: () => void;
  onRepositoryClick: (repository: Repository) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const mockPullRequests: PullRequest[] = [
  {
    id: '1',
    title: 'Implement dark mode toggle with system preference detection',
    repository: 'portfolio-website',
    status: 'open'
  },
  {
    id: '2',
    title: 'Fix memory leak in data processing worker threads',
    repository: 'data-pipeline',
    status: 'open'
  },
  {
    id: '3',
    title: 'Update dependencies and security patches',
    repository: 'task-management-app',
    status: 'merged'
  }
];

const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Mobile responsiveness issues on Safari iOS',
    repository: 'portfolio-website',
    status: 'open'
  },
  {
    id: '2',
    title: 'API timeout handling needs improvement',
    repository: 'api-gateway',
    status: 'open'
  }
];

export function MainDashboard({ user, repositories, onLogout, onRepositoryClick, isDarkMode, onToggleTheme }: MainDashboardProps) {
  const [activeSection, setActiveSection] = useState('projects');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'projects':
        return <ProjectsView repositories={repositories} onRepositoryClick={onRepositoryClick} />;
      case 'activity':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl text-foreground mb-2">Activity Feed</h1>
              <p className="text-muted-foreground">Stay updated with your project activities and team collaboration.</p>
            </div>
            <ActionItems />
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl text-foreground mb-2">Analytics</h1>
              <p className="text-muted-foreground">Insights and metrics about your development workflow and project performance.</p>
            </div>
            <div className="text-center py-20">
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        isDarkMode={isDarkMode} 
        onToggleTheme={onToggleTheme}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}