import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, BarChart3, PieChart, GitCommit, Target, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, TooltipProps } from 'recharts';
import { User, Repository } from '../App';
import { getLanguageColor } from '../lib/utils'; 

interface RepositoryDetailProps {
  user: User;
  repository: Repository;
  onBack: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

type RepoStats = {
  commitActivity: { week: number; total: number; days: number[] }[];
  languages: Record<string, number>;
};

const milestoneData = [
  { name: 'Authentication System', status: 'completed', dueDate: 'Jan 15', progress: 100 },
  { name: 'API Integration', status: 'completed', dueDate: 'Feb 1', progress: 100 },
  { name: 'UI Components', status: 'in-progress', dueDate: 'Feb 28', progress: 75 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].name}</span>
            <span className="font-bold text-foreground">{payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export function RepositoryDetail({ user, repository, onBack, onLogout, isDarkMode, onToggleTheme }: RepositoryDetailProps) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('githubToken');
        if (!token) {
          onLogout();
          return;
        }
        const res = await axios.get(
          `http://localhost:8080/api/repos/${repository.owner.login}/${repository.name}/stats`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching repo stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepoStats();
  }, [repository, onLogout]);

  const commitData = (stats?.commitActivity && Array.isArray(stats.commitActivity))
    ? stats.commitActivity.map((week, index) => ({
        week: `Week ${index + 1}`,
        commits: week.total,
      }))
    : [];

  const languageData = stats?.languages
    ? Object.entries(stats.languages).map(([name, value]) => ({
        name,
        value,
        color: getLanguageColor(name) 
      }))
    : [];
    
  const progress = repository.progress || 75;
  const completedMilestones = repository.completedMilestones || 2;
  const totalMilestones = repository.milestones || 5;
  const totalCommits = commitData.reduce((sum, week) => sum + week.commits, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading repository details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl text-foreground mb-2">
                {repository.owner.login}/{repository.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {repository.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="text-lg text-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-lg text-foreground">{completedMilestones}/{totalMilestones}</p>
                      <p className="text-sm text-muted-foreground">Milestones Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <GitCommit className="w-8 h-8 text-success" />
                    <div>
                      <p className="text-lg text-foreground">{totalCommits}</p>
                      <p className="text-sm text-muted-foreground">Commits (Year)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Project Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestoneData.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : milestone.status === 'in-progress' ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className="text-foreground">{milestone.name}</span>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due {milestone.dueDate}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Commit Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={commitData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                    <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-success" />
                <span>Language Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3 border-t border-border pt-6">
                {languageData.map((language) => (
                  <div key={language.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: language.color }} />
                      <span className="text-foreground">{language.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">{language.value.toLocaleString()} bytes</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}