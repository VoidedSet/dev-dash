export const getLanguageColor = (language: string | null): string => {
  if (!language) return '#6b7280';

  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    Go: '#00ADD8',
    Rust: '#dea584',
    React: '#61dafb', 
    Vue: '#4FC08D',
    Swift: '#FA7343',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Ruby: '#701516',
    PHP: '#4F5D95',
  };
  return colors[language] || '#6b7280'; 
};

export const formatNumber = (num: number | undefined | null): string => {
  if (typeof num !== 'number') {
    return '0';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};