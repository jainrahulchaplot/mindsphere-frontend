# MindSphere Frontend

> React + TypeScript + Vite frontend for AI-powered meditation and sleep stories

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env with your credentials
```

### Development

```bash
# Start development server
npm run dev

# Access at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Architecture

### Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **React Query** for server state management
- **Axios** for HTTP requests

### Project Structure
```
src/
├── components/      # React components
├── pages/          # Page components
├── api/            # API layer
├── hooks/          # Custom hooks
├── contexts/       # React contexts
├── utils/          # Utility functions
└── config/         # Configuration files
```

---

## 🔌 API Integration

This frontend connects to the MindSphere Backend API:
- **Local Development**: http://localhost:8000
- **Production**: Configure in `.env` file

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 📦 Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Build and analyze
npm run build:analyze
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables
Set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`
- `VITE_BACKEND_URL`
- `VITE_LIVEKIT_URL`

---

## 📝 License

Part of the MindSphere project.

