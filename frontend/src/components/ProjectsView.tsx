import React from 'react';
import { RepositoryCard } from './RepositoryCard';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Filter, Plus, SortDesc, Grid3X3, List, FolderGit2 } from 'lucide-react';
import { Repository } from '../App';

interface ProjectsViewProps {
  repositories: Repository[];
  onRepositoryClick: (repository: Repository) => void;
}

export function ProjectsView({ repositories, onRepositoryClick }: ProjectsViewProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredRepositories = (repositories || []).filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage and explore your development projects</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Searchibng */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortDesc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredRepositories.length === 0 ? (
        <Card className="bg-card border border-border">
          <CardContent className="p-12 text-center">
            <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria or create a new project.</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredRepositories.map(repository => (
            <RepositoryCard
              key={repository.id}
              repository={repository}
              onClick={onRepositoryClick}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}