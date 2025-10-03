import React from 'react';
import { createLazyComponent, createLazyRoute } from '@/components/LazyWrapper';

// Lazy load pages for code splitting
export const LazyDashboard = createLazyRoute(
  () => import('./Dashboard'),
  'dashboard'
);

export const LazyProfile = createLazyRoute(
  () => import('./Profile'),
  'profile'
);

export const LazySession = createLazyRoute(
  () => import('./Session'),
  'session'
);

export const LazyJournal = createLazyRoute(
  () => import('./Journal'),
  'journal'
);

export const LazyLibrary = createLazyRoute(
  () => import('./Library'),
  'library'
);

export const LazySettings = createLazyRoute(
  () => import('./Settings'),
  'settings'
);

export const LazyAbout = createLazyRoute(
  () => import('./About'),
  'about'
);

export const LazyContact = createLazyRoute(
  () => import('./Contact'),
  'contact'
);

export const LazyPrivacy = createLazyRoute(
  () => import('./Privacy'),
  'privacy'
);

export const LazyTerms = createLazyRoute(
  () => import('./Terms'),
  'terms'
);

// Lazy load components that are not immediately needed
export const LazyVoiceAgent = createLazyComponent(
  () => import('@/components/VoiceAgent'),
  {
    fallback: <div className="loading-voice-agent">Loading voice agent...</div>,
  }
);

export const LazyMusicPlayer = createLazyComponent(
  () => import('@/components/MusicPlayer'),
  {
    fallback: <div className="loading-music-player">Loading music player...</div>,
  }
);

export const LazyChatInterface = createLazyComponent(
  () => import('@/components/ChatInterface'),
  {
    fallback: <div className="loading-chat">Loading chat...</div>,
  }
);

export const LazyAnalytics = createLazyComponent(
  () => import('@/components/Analytics'),
  {
    fallback: <div className="loading-analytics">Loading analytics...</div>,
  }
);

export const LazyReports = createLazyComponent(
  () => import('@/components/Reports'),
  {
    fallback: <div className="loading-reports">Loading reports...</div>,
  }
);

// Lazy load heavy components
export const LazyDataVisualization = createLazyComponent(
  () => import('@/components/DataVisualization'),
  {
    fallback: <div className="loading-charts">Loading charts...</div>,
  }
);

export const LazyFileUpload = createLazyComponent(
  () => import('@/components/FileUpload'),
  {
    fallback: <div className="loading-upload">Loading file upload...</div>,
  }
);

export const LazyImageGallery = createLazyComponent(
  () => import('@/components/ImageGallery'),
  {
    fallback: <div className="loading-gallery">Loading gallery...</div>,
  }
);

// Lazy load admin components
export const LazyAdminPanel = createLazyRoute(
  () => import('./AdminPanel'),
  'admin'
);

export const LazyUserManagement = createLazyComponent(
  () => import('@/components/UserManagement'),
  {
    fallback: <div className="loading-users">Loading user management...</div>,
  }
);

export const LazySystemSettings = createLazyComponent(
  () => import('@/components/SystemSettings'),
  {
    fallback: <div className="loading-system">Loading system settings...</div>,
  }
);

// Lazy load modal components
export const LazyModal = createLazyComponent(
  () => import('@/components/Modal'),
  {
    fallback: <div className="loading-modal">Loading modal...</div>,
  }
);

export const LazyConfirmDialog = createLazyComponent(
  () => import('@/components/ConfirmDialog'),
  {
    fallback: <div className="loading-dialog">Loading dialog...</div>,
  }
);

export const LazyNotificationCenter = createLazyComponent(
  () => import('@/components/NotificationCenter'),
  {
    fallback: <div className="loading-notifications">Loading notifications...</div>,
  }
);

// Preload critical components
export function preloadCriticalComponents(): void {
  // Preload components that are likely to be used soon
  import('./Dashboard');
  import('./Profile');
  import('./Session');
  import('./Journal');
}

// Preload components based on user behavior
export function preloadComponentsOnHover(): void {
  // Preload components when user hovers over navigation links
  const navLinks = document.querySelectorAll('nav a[href]');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href) {
        switch (href) {
          case '/dashboard':
            import('./Dashboard');
            break;
          case '/profile':
            import('./Profile');
            break;
          case '/session':
            import('./Session');
            break;
          case '/journal':
            import('./Journal');
            break;
          case '/library':
            import('./Library');
            break;
          case '/settings':
            import('./Settings');
            break;
        }
      }
    });
  });
}

// Initialize preloading
if (typeof window !== 'undefined') {
  // Preload critical components after initial load
  setTimeout(preloadCriticalComponents, 2000);
  
  // Set up hover preloading
  preloadComponentsOnHover();
}
