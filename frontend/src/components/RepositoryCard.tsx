import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Star, GitFork, Clock, CheckCircle, AlertCircle, Target, ExternalLink } from 'lucide-react';
import { Repository } from '../App';
import { getLanguageColor, formatNumber } from '../lib/utils'; 

interface RepositoryCardProps {
  repository: Repository;
  onClick: (repository: Repository) => void;
  viewMode?: 'grid' | 'list';
}

export function RepositoryCard({ repository, onClick, viewMode = 'grid' }: RepositoryCardProps) {

  const progress = repository.progress || Math.floor(Math.random() * 100);
  const milestones = repository.milestones || Math.floor(Math.random() * 10) + 1;
  const completedMilestones = repository.completedMilestones || Math.floor(milestones * (progress / 100));

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 bg-card border border-border group"
        onClick={() => onClick(repository)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg text-foreground truncate group-hover:text-primary transition-colors">
                    {repository.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(repository.language) }}
                    />
                    <span className="text-sm text-muted-foreground">{repository.language || 'N/A'}</span>
                  </div>
                  {repository.ciStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {repository.description || 'No description available'}
                </p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{formatNumber(repository.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{formatNumber(repository.forks_count)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{completedMilestones}/{milestones} milestones</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated {new Date(repository.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 w-32" />
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 bg-card border border-border group"
      onClick={() => onClick(repository)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {repository.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getLanguageColor(repository.language) }}
              />
              <span className="text-sm text-muted-foreground">{repository.language || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {repository.ciStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {repository.description || 'No description available'}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{completedMilestones}/{milestones} milestones</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{formatNumber(repository.stargazers_count)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="w-4 h-4" />
              <span>{formatNumber(repository.forks_count)}</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{new Date(repository.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}