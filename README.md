# PhishShield AI - Frontend

A production-quality Next.js frontend for PhishShield AI, an AI-powered phishing detection and URL security analysis tool. Built with TypeScript, React Query, Zustand, and Chart.js.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT tokens
- **URL Scanning**: Real-time phishing detection with detailed risk analysis
- **Scan History**: Track and manage your previous URL scans
- **Analytics Dashboard**: Visualize scanning trends and risk distribution with Chart.js
- **Admin Panel**: User management and system activity monitoring (admin-only)
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript coverage with strict mode
- **Error Handling**: Comprehensive error boundaries and toast notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **State Management**: 
  - Server state: TanStack Query (React Query)
  - Client state: Zustand
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Charts**: Chart.js via react-chartjs-2
- **Testing**: Vitest + React Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running at `https://phishshield-ai-pari.onrender.com`

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PhishShield-AI-Web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure the API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://phishshield-ai-pari.onrender.com
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout with providers
├── providers.tsx           # React Query + Toast providers
├── page.tsx               # Home page (redirects based on auth)
├── login/page.tsx         # Login page
├── register/page.tsx      # Registration page
├── dashboard/page.tsx      # Main dashboard with URL scanning
├── history/page.tsx       # Scan history with pagination
├── history/[scanId]/      # Individual scan detail view
├── analytics/page.tsx      # Analytics dashboard with charts
├── admin/page.tsx          # Admin panel (role-gated)
├── error.tsx              # Global error boundary
└── not-found.tsx          # 404 page

components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Toast.tsx
│   ├── Skeleton.tsx
│   └── ToastProvider.tsx
├── layout/                # Layout components
│   ├── AppShell.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
└── features/              # Feature-specific components
    ├── scan/             # URL scanning components
    ├── history/          # History management
    ├── analytics/        # Analytics visualizations
    └── admin/            # Admin panel components

lib/
├── api/                  # Typed API client functions
│   ├── auth.ts
│   ├── scans.ts
│   ├── analytics.ts
│   └── admin.ts
├── axios.ts              # Configured Axios instance
└── utils.ts              # Utility functions

hooks/                    # React Query hooks
├── useAuth.ts
├── useScans.ts
├── useAnalytics.ts
└── useAdmin.ts

store/                    # Zustand stores
└── authStore.ts          # Authentication state

types/                    # TypeScript types
└── index.ts              # Shared type definitions

tests/                    # Test files
├── ui/
└── layout/
```

## 🔐 Authentication & Security

### JWT Token Storage Decision

**Tradeoff Analysis**: This application uses `sessionStorage` for JWT token storage instead of `localStorage` or in-memory-only storage.

**Rationale**:
- **sessionStorage vs localStorage**: While both are vulnerable to XSS, sessionStorage is slightly safer as tokens are cleared when the tab/window closes, reducing the exposure window.
- **sessionStorage vs in-memory**: In-memory storage would provide the best security but would force logout on every page refresh, creating poor UX. Since the backend doesn't provide a refresh token endpoint, sessionStorage is the documented "lesser evil" compromise.

**Security Measures**:
- JWT tokens are attached via Axios interceptors
- Global 401 handling clears session and redirects to login
- Protected routes use client-side checks via ProtectedRoute component
- Content sanitization for user-provided URLs
- No sensitive data logging

### API Endpoints

The application connects to the following backend endpoints:

**Authentication**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

**Scanning**:
- `POST /api/scan/` - Submit URL for analysis
- `GET /api/scan/history` - Get scan history (paginated)
- `GET /api/scan/history/{scan_id}` - Get specific scan details
- `DELETE /api/scan/history/{scan_id}` - Delete scan

**Analytics**:
- `GET /api/analytics/summary` - Get user statistics
- `GET /api/analytics/trends` - Get scanning trends
- `GET /api/analytics/risk-distribution` - Get risk distribution

**Admin** (admin-only):
- `GET /api/admin/activity` - System activity
- `GET /api/admin/scans` - All scans (paginated)
- `GET /api/admin/users` - All users (paginated)
- `PATCH /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

## 🎨 Design System

The application uses a custom design token system in Tailwind CSS:

- **Colors**: Security-themed palette (blue primary, semantic status colors)
- **Spacing**: Consistent scale (xs, sm, md, lg, xl, 2xl)
- **Typography**: System fonts with fallback chains
- **Components**: Reusable UI components with consistent styling

## ♿ Accessibility

- Semantic HTML elements throughout
- ARIA labels and roles for interactive elements
- Keyboard navigation support
- Focus indicators for all interactive elements
- Screen reader-friendly content
- Color-safe indicators (icons + labels, not color alone)

## 📱 Responsive Design

- Mobile-first approach with breakpoints at 375px, 768px, 1024px, 1280px
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes
- Horizontal scrolling for tables on mobile

## 🧪 Testing

The application includes component tests for critical paths:

- Button component functionality
- Input component validation
- Protected route behavior

Run tests with:
```bash
npm test
```

## 🔒 Role-Based Access Control

- **User**: Can access dashboard, history, and analytics
- **Admin**: Can access all user routes plus admin panel
- Route protection implemented via ProtectedRoute component
- Admin panel includes user management and system monitoring

## 🚀 Deployment

### Environment Variables

Required environment variable:
- `NEXT_PUBLIC_API_URL`: Backend API base URL

### Build Process

The application uses Next.js optimized build with:
- TypeScript compilation
- Tree shaking
- Code splitting
- Image optimization
- Font optimization

### Deployment Platforms

Compatible with:
- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

## 📝 API Contract

All API calls are typed with TypeScript interfaces. The API contract is defined in:
- `types/index.ts` - Shared type definitions
- `lib/api/*.ts` - API client functions with typed responses

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Ensure TypeScript strict mode compliance
4. Test responsive design
5. Verify accessibility compliance

## 📄 License

[Specify your license here]

## 🆘 Support

For issues or questions:
- Check the API documentation at `/api/docs`
- Review the backend status
- Check browser console for errors
- Verify environment variables are set correctly