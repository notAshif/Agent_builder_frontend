# AI Agent Builder - Frontend

A modern React frontend for building and managing AI agents with a beautiful glass-morphism UI.

## Tech Stack

- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS v4** - Utility-first CSS with custom design system
- **Framer Motion** - Smooth animations and transitions
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **Zustand** - State management
- **Sonner** - Toast notifications

## Features

- **Authentication** - Login, Register, OAuth (Google/GitHub)
- **Dashboard** - Real-time agent monitoring with live activity feed
- **Agent Management** - Create, edit, and manage AI agents
- **Workflow Builder** - Visual drag-and-drop agent workflow design
- **Run Execution** - Execute agents with real-time streaming logs
- **Tool Management** - Create and manage custom webhook tools
- **Settings** - User profile and API key management
- **Pricing Page** - Transparent pricing with plan comparison
- **Support Form** - Contact form for support inquiries

## Design System

The app uses a modern "glass" design aesthetic:

```css
/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glass card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

**Color Palette:**
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Background: `#0a0a0f` (Dark)
- Surface: `rgba(255, 255, 255, 0.05)`
- Border: `rgba(255, 255, 255, 0.1)`

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client functions
│   │   ├── client.ts         # Axios instance with interceptors
│   │   ├── agent.ts          # Agent CRUD operations
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── contact.ts       # Contact form submissions
│   │   ├── events.ts        # Server-Sent Events setup
│   │   ├── run.ts            # Run execution endpoints
│   │   └── tool.ts          # Tool management endpoints
│   ├── components/
│   │   ├── agents/          # Agent-related components
│   │   │   ├── AgentCard.tsx
│   │   │   ├── AgentLogicGraph.tsx
│   │   │   ├── ConversationChat.tsx
│   │   │   ├── OutputDestinations.tsx
│   │   │   ├── SchedulePanel.tsx
│   │   │   └── WorkflowBuilder.tsx
│   │   ├── auth/             # Auth-related components
│   │   │   └── OAuthButtons.tsx
│   │   ├── dashboard/       # Dashboard components
│   │   │   └── StatsCard.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── runs/             # Run-related components
│   │   │   ├── FlowVisualization.tsx
│   │   │   ├── LogTimeline.tsx
│   │   │   └── RichOutput.tsx
│   │   └── ui/              # Reusable UI components
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Label.tsx
│   │       ├── Select.tsx
│   │       └── Textarea.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication state management
│   │   └── useEventStream.ts # Server-Sent Events connection
│   ├── pages/                # Page components
│   │   ├── Landing.tsx       # Public landing page
│   │   ├── Dashboard.tsx     # Protected dashboard
│   │   ├── Agents.tsx       # Agent list
│   │   ├── AgentDetail.tsx  # Agent details
│   │   ├── RunDetail.tsx     # Run execution details
│   │   ├── Tools.tsx        # Tool management
│   │   ├── Settings.tsx     # User settings
│   │   ├── Pricing.tsx       # Pricing page
│   │   ├── Support.tsx       # Contact/support page
│   │   ├── auth/             # Auth pages
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── AuthCallback.tsx
│   │   └── agents/           # Agent pages
│   │       └── NewAgent.tsx
│   ├── stores/               # State management
│   │   └── authStore.ts      # Auth state with Zustand
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── lib/                  # Utility functions
│   │   └── utils.ts
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── Dockerfile                # Docker container build
├── nginx.conf               # Nginx configuration
└── package.json
```

## Environment Variables

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000/api/v1
```

## Development

### Prerequisites

- Node.js 18+ or Bun
- Running backend server (http://localhost:3000)

### Setup

```bash
# Install dependencies
npm install
# or with Bun
bun install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker

```bash
# Build Docker image
docker build -t agentbuilder-frontend .

# Run container
docker run -p 80:80 agentbuilder-frontend
```

## API Integration

The frontend communicates with the backend via REST API:

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
- Token is stored in `localStorage.getItem("access_token")`
- Axios interceptor adds Bearer token to all requests
- 401 responses trigger automatic logout redirect

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/google` | Google OAuth |
| POST | `/auth/github` | GitHub OAuth |
| GET | `/agents` | List agents |
| POST | `/agents` | Create agent |
| GET | `/agents/:id` | Get agent details |
| PUT | `/agents/:id` | Update agent |
| DELETE | `/agents/:id` | Delete agent |
| POST | `/agents/:id/run` | Run agent |
| GET | `/runs/:id` | Get run details |
| GET | `/tools` | List tools |
| POST | `/tools` | Create tool |
| POST | `/contact` | Submit contact form |

### Server-Sent Events

Real-time updates via SSE at `/events/stream`:

```typescript
const eventSource = new EventSource(`${API_URL}/events/stream?token=${token}`);

eventSource.onmessage = (e) => {
  const { event, data } = JSON.parse(e.data);
  // Handle events: run:created, run:completed, run:failed, log:created
};
```

## Component Usage

### Button

```tsx
import { Button } from "./components/ui/Button";

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Input

```tsx
import { Input } from "./components/ui/Input";

<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Error message"
/>
```

## Routing

The app uses protected routes that require authentication:

```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Landing page |
| `/auth/login` | No | Login page |
| `/auth/register` | No | Registration |
| `/dashboard` | Yes | Main dashboard |
| `/agents` | Yes | Agent list |
| `/agents/:id` | Yes | Agent detail |
| `/runs/:id` | Yes | Run details |
| `/tools` | Yes | Tool management |
| `/settings` | Yes | User settings |
| `/pricing` | No | Pricing page |
| `/support` | No | Contact form |

## Testing with TestSprite

The project is configured for automated testing:

1. **Setup**: TestSprite uses credentials from `testsprite_tests/tmp/config.json`
2. **Test User**: `newuser@example.com` / `TestPass123!`
3. **Run Tests**:
   ```bash
   node testsprite_tests/node_modules/@testsprite/testsprite-mcp/dist/index.js generateCodeAndExecute
   ```

## License

MIT
