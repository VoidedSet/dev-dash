import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { GitPullRequest, Bug, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import { PullRequest, Issue } from '../App';

export function ActionItems() {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActionItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('githubToken');
        const api = axios.create({
          baseURL: 'http://localhost:8080/api',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const res = await api.get('/user/action-items');
        setPullRequests(res.data.pullRequests || []);
        setIssues(res.data.issues || []);
      } catch (error) {
        console.error("Error fetching action items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActionItems();
  }, []);

  const getRepoNameFromUrl = (url: string) => {
    try {
      const parts = new URL(url).pathname.split('/');
      return parts.slice(2, 4).join('/');
    } catch {
      return 'unknown repository';
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Loading Action Items...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fetching data from GitHub...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Action Items</span>
          </div>
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {pullRequests.length + issues.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pullRequests" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="pullRequests" className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4" />
              <span>Pull Requests</span>
              <Badge variant="secondary" className="ml-auto">{pullRequests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span>Issues</span>
              <Badge variant="secondary" className="ml-auto">{issues.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pullRequests" className="mt-6">
            <div className="space-y-3">
              {pullRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <p className="text-muted-foreground">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No pull requests need your attention</p>
                </div>
              ) : (
                pullRequests.map(pr => (
                  <a href={pr.html_url} target="_blank" rel="noopener noreferrer" key={pr.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate mb-1">{pr.title}</p>
                      <p className="text-xs text-muted-foreground">{getRepoNameFromUrl(pr.repository_url)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {pr.state}
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </a>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="issues" className="mt-6">
            <div className="space-y-3">
              {issues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <p className="text-muted-foreground">All clear!</p>
                  <p className="text-sm text-muted-foreground">No issues assigned to you</p>
                </div>
              ) : (
                issues.map(issue => (
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer" key={issue.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate mb-1">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{getRepoNameFromUrl(issue.repository_url)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                        {issue.state}
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </a>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}