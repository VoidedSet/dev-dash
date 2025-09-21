import React from 'react';
import { Button } from './ui/button';
import { Github, Moon, Sun } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function LoginPage({ onLogin, isDarkMode, onToggleTheme }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-full"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <div className="text-3xl text-primary-foreground">📊</div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl tracking-tight text-foreground">DevDash</h1>
            <p className="text-lg text-muted-foreground">Your development command center</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Track projects, monitor progress, and manage your development workflow in one clean interface.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onLogin}
            size="lg"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground gap-3"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Connect your GitHub account to get started
          </p>
        </div>
      </div>
    </div>
  );
}