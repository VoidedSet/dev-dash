import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  GitFork, 
  Star, 
  Zap, 
  Target, 
  Code,
  Clock,
  CheckCircle,
  GitCommit,
  Users,
  Calendar,
  Activity
} from 'lucide-react';

export function DashboardOverview() {
  const stats = [
    { 
      title: 'Total Stars', 
      value: '2,147', 
      change: '+12%', 
      icon: Star, 
      color: 'text-warning' 
    },
    { 
      title: 'Total Forks', 
      value: '324', 
      change: '+5%', 
      icon: GitFork, 
      color: 'text-success' 
    },
    { 
      title: 'Active Projects', 
      value: '8', 
      change: '+2', 
      icon: Zap, 
      color: 'text-primary' 
    },
    { 
      title: 'This Month', 
      value: '247', 
      change: '+18%', 
      icon: GitCommit, 
      color: 'text-destructive' 
    }
  ];

  const recentActivity = [
    {
      type: 'commit',
      message: 'feat: add dark mode toggle functionality',
      repo: 'portfolio-website',
      time: '2 hours ago',
      icon: GitCommit
    },
    {
      type: 'pr',
      message: 'Fix memory leak in data processing pipeline',
      repo: 'data-pipeline', 
      time: '4 hours ago',
      icon: TrendingUp
    },
    {
      type: 'milestone',
      message: 'Completed "Authentication System" milestone',
      repo: 'task-management-app',
      time: '1 day ago', 
      icon: Target
    },
    {
      type: 'review',
      message: 'Code review completed for API integration',
      repo: 'api-gateway',
      time: '2 days ago',
      icon: CheckCircle
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'UI Components Release',
      project: 'task-management-app',
      date: 'Feb 28',
      daysLeft: 3,
      progress: 75
    },
    {
      title: 'Testing Suite Implementation', 
      project: 'api-gateway',
      date: 'Mar 15',
      daysLeft: 18,
      progress: 20
    },
    {
      title: 'Documentation Update',
      project: 'mobile-game-engine',
      date: 'Mar 30',
      daysLeft: 33,
      progress: 10
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl text-foreground mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl text-foreground">{stat.value}</p>
                    <p className={`text-xs ${stat.color} mt-1`}>{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground mb-1">{activity.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{activity.repo}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-warning" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due {deadline.date}</p>
                    <p className="text-xs text-warning">{deadline.daysLeft} days left</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{deadline.progress}%</span>
                  </div>
                  <Progress value={deadline.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-left">
              <Code className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-foreground">New Repository</p>
                <p className="text-xs text-muted-foreground">Create a new project</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-left">
              <Target className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-foreground">Add Milestone</p>
                <p className="text-xs text-muted-foreground">Set project goals</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-left">
              <Users className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm text-foreground">Team Invite</p>
                <p className="text-xs text-muted-foreground">Collaborate with others</p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-left">
              <Clock className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-sm text-foreground">Time Tracking</p>
                <p className="text-xs text-muted-foreground">Log work hours</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}