# MindSphere Frontend

> React + TypeScript web application for MindSphere mental wellness platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
cp env.example .env
# Edit .env with your credentials
```

### Development
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm test           # Run tests
```

## 📁 Project Structure

```
src/
├── api/              # API client and types
├── components/       # Reusable UI components
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── pages/           # Page components
├── state/           # State management
├── utils/           # Helper functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🎨 Key Components

### Core Components
- `AudioContext` - Audio management
- `AuthContext` - Authentication state
- `SessionManager` - Session handling
- `VoiceInterface` - Voice interaction UI

### Pages
- `Dashboard` - Main user dashboard
- `Session` - Voice session interface
- `Profile` - User profile management
- `Library` - Content library
- `Settings` - App settings

## 🔧 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Backend API
VITE_API_BASE_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000

# LiveKit
VITE_LIVEKIT_URL=your_livekit_url

# Environment
VITE_ENV=development
VITE_NODE_ENV=development
```

## 🎯 Features

### Voice Interface
- Real-time voice interaction
- LiveKit integration
- Audio visualization
- Session recording

### User Management
- Authentication via Supabase
- Profile management
- Session history
- Progress tracking

### Content Library
- Music tracks
- Inspirational quotes
- Session templates
- Personal notes

### Responsive Design
- Mobile-first approach
- Tailwind CSS styling
- Dark/light theme support
- Accessibility features

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- component.test.tsx
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build for Production
```bash
npm run build
# Output in dist/ folder
```

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom theme configuration
- Responsive design utilities
- Dark mode support

### Custom Components
- Reusable UI components
- Consistent design system
- Accessibility compliant
- Mobile optimized

## 🔧 Development

### Adding New Pages
1. Create page component in `pages/`
2. Add route in `App.tsx`
3. Update navigation if needed
4. Add tests

### State Management
- React Context for global state
- Custom hooks for local state
- Supabase for data persistence
- Optimistic updates

### API Integration
- Centralized API client
- Type-safe API calls
- Error handling
- Loading states

### Error Handling
- No fallback data - fail fast with clear errors
- Comprehensive error logging with correlation IDs
- Service-specific error tracking
- Environment-aware logging levels

### Git Workflow
```bash
# Make changes
git add .
git commit -m "feat: add voice interface component"
git push origin feature/voice-interface
```

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-specific optimizations
- PWA capabilities

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript types
2. **API Errors**: Verify backend connection
3. **Voice Issues**: Check LiveKit configuration
4. **Styling Issues**: Verify Tailwind classes

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

## 📚 Dependencies

### Core
- `react` - UI library
- `react-dom` - DOM rendering
- `typescript` - Type safety
- `vite` - Build tool

### UI & Styling
- `tailwindcss` - CSS framework
- `@headlessui/react` - UI components
- `@heroicons/react` - Icons

### State & Data
- `@supabase/supabase-js` - Database client
- `react-query` - Data fetching
- `zustand` - State management

### Voice & Audio
- `livekit-client` - Voice integration
- `@livekit/components-react` - Voice UI

### Utilities
- `clsx` - Class name utility
- `date-fns` - Date manipulation
- `react-hook-form` - Form handling

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.