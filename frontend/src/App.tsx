import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoginPage } from './components/LoginPage';
import { MainDashboard } from './components/MainDashboard';
import { RepositoryDetail } from './components/RepositoryDetail';

// < 0 > Type Definitions < 0 >
export type User = {
  id: number;
  username: string;
  avatarUrl: string; 
  name: string;
};

export type Repository = {
  id: string;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: { login: string; };
  ciStatus?: 'success' | 'failure';
  progress?: number;
  milestones?: number;
  completedMilestones?: number;
};

export type PullRequest = {
  id: string;
  title: string;
  html_url: string; 
  repository_url: string; 
  state: 'open' | 'closed'; 
};

export type Issue = {
  id: string;
  title: string;
  html_url: string;
  repository_url: string;
  state: 'open' | 'closed';
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'dashboard' | 'repository'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        localStorage.setItem('githubToken', token);
        window.history.replaceState({}, document.title, "/");
        await fetchData(token);
      } else {
        const storedToken = localStorage.getItem('githubToken');
        if (storedToken) {
          await fetchData(storedToken);
        } else {
          setIsLoading(false); 
        }
      }
    };
    handleAuthCallback();
  }, []);

  const fetchData = async (token: string) => {
    setIsLoading(true);
    try {
      const api = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const [userRes, repoRes] = await Promise.all([
        api.get('/user/me'),
        api.get('/repos')
      ]);

      if (userRes.data && repoRes.data) {
        setUser(userRes.data);
        setRepositories(repoRes.data);
        setCurrentScreen('dashboard');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/github';
  };

  const handleLogout = () => {
    localStorage.removeItem('githubToken');
    setUser(null);
    setRepositories([]);
    setCurrentScreen('login');
  };

  const handleRepositoryClick = (repository: Repository) => {
    setSelectedRepository(repository);
    setCurrentScreen('repository');
  };

  const handleBackToDashboard = () => {
    setSelectedRepository(null);
    setCurrentScreen('dashboard');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (isLoading) {
    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''} bg-background flex items-center justify-center`}>
            <p className="text-muted-foreground">Loading DevDash...</p>
        </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {currentScreen === 'login' && (
        <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      )}
      
      {currentScreen === 'dashboard' && user && (
        <MainDashboard 
          user={user} 
          repositories={repositories}
          onLogout={handleLogout}
          onRepositoryClick={handleRepositoryClick}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}
      
      {currentScreen === 'repository' && user && selectedRepository && (
        <RepositoryDetail 
          user={user}
          repository={selectedRepository}
          onBack={handleBackToDashboard}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}