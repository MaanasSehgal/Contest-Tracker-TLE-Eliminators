import { useEffect } from 'react';
import useStore from '../../zustand/useStore.store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentTheme, setCurrentTheme } = useStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setCurrentTheme]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
