import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = savedTheme === 'light';
    setIsLight(prefersLight);
    document.documentElement.className = prefersLight ? 'theme-light' : 'theme-dark';
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLight;
    setIsLight(newTheme);
    document.documentElement.className = newTheme ? 'theme-light' : 'theme-dark';
    localStorage.setItem('theme', newTheme ? 'light' : 'dark');
  };

  return (
    <button 
      className="btn px-2 py-1 text-xs"
      onClick={toggleTheme}
      title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
    >
      {isLight ? '🌙' : '☀️'}
    </button>
  );
}
