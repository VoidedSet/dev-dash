import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  Home, 
  FolderGit2, 
  Activity, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  GitPullRequest,
  Bug,
  Target,
  BarChart3
} from 'lucide-react';
import { User } from '../App';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ user, onLogout, isDarkMode, onToggleTheme, activeSection, onSectionChange }: SidebarProps) {
  const navigation = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'projects', name: 'Projects', icon: FolderGit2 },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const quickActions = [
    { id: 'prs', name: 'Pull Requests', icon: GitPullRequest, count: 3 },
    { id: 'issues', name: 'Issues', icon: Bug, count: 2 },
    { id: 'milestones', name: 'Milestones', icon: Target, count: 8 },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      {/* Theme Toggle */}
      
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-lg text-primary-foreground">📊</span>
            </div>
            <span className="text-xl tracking-tight text-foreground">DevDash</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* mock settings - logout */}
      <div className="p-4 border-t border-border space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}