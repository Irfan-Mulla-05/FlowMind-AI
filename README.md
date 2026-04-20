# FlowPilot AI

FlowPilot AI is a full-stack MERN productivity SaaS that blends a fast to-do workflow with AI planning, role-aware suggestions, notes, analytics, gamification, and future-roadmap support.

## 1. Complete Folder Structure

```text
Codex/
  backend/
    .env.example
    package.json
    src/
      app.js
      server.js
      config/
        db.js
        env.js
      controllers/
        aiController.js
        analyticsController.js
        authController.js
        dashboardController.js
        noteController.js
        taskController.js
      data/
        seed.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
        validateRequest.js
      models/
        ActivityLog.js
        AIInsight.js
        Habit.js
        Note.js
        ProductivityMetric.js
        Task.js
        User.js
      routes/
        aiRoutes.js
        analyticsRoutes.js
        authRoutes.js
        dashboardRoutes.js
        noteRoutes.js
        taskRoutes.js
      services/
        activityService.js
        aiService.js
        analyticsService.js
        dashboardService.js
      utils/
        appError.js
        asyncHandler.js
        constants.js
        jwt.js
        planner.js
        productivity.js
        roleConfig.js
      validations/
        aiValidation.js
        authValidation.js
        noteValidation.js
        taskValidation.js
  frontend/
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
    src/
      App.jsx
      main.jsx
      api/
        aiApi.js
        authApi.js
        client.js
        dashboardApi.js
        noteApi.js
        taskApi.js
      assets/
        index.css
      components/
        common/
          Button.jsx
          Card.jsx
          EmptyState.jsx
          Input.jsx
          Loader.jsx
          PageHeader.jsx
          StatCard.jsx
        dashboard/
          FocusTasks.jsx
          InsightCard.jsx
          OverviewCharts.jsx
        notes/
          NoteCard.jsx
          NoteEditorDrawer.jsx
          RichTextEditor.jsx
        planner/
          AiPlannerPanel.jsx
          SlotColumn.jsx
        tasks/
          QuickTaskBar.jsx
          TaskCard.jsx
          TaskFormDrawer.jsx
      context/
        AuthContext.jsx
      data/
        navItems.js
        templates.js
      layouts/
        DashboardLayout.jsx
      pages/
        AnalyticsPage.jsx
        DashboardPage.jsx
        LandingPage.jsx
        LoginPage.jsx
        NotesPage.jsx
        PlannerPage.jsx
        RegisterPage.jsx
        RoadmapPage.jsx
        SettingsPage.jsx
        TasksPage.jsx
      routes/
        ProtectedRoute.jsx
      utils/
        cn.js
        format.js
        storage.js
  .gitignore
  README.md
```

## 2. Database Schema Design

### Users
- `name`, `email`, `password`
- `role`: `Student | Developer | Professional`
- `lifeMode`: `Student Mode | Developer Mode | Fitness Mode`
- `avatar`
- `preferredTheme`, `preferredProductivityPeriod`
- `xp`, `level`, `streak`, `achievements`
- `settings`: reminders, browser notifications, energy profile
- `aiPreferences`: provider, planning style, auto-breakdown, auto-reschedule
- `createdAt`, `updatedAt`

### Tasks
- `user`
- `title`, `description`
- `priority`, `category`
- `deadline`, `dueDate`, `tags`
- `status`, `important`
- `estimatedDuration`, `actualDuration`
- `energyLevel`, `preferredSlot`
- `recurrence`
- `aiGenerated`
- `orderIndex`
- `linkedNote`
- `completedAt`, `archivedAt`

### Notes
- `user`
- `title`
- `content`
- `pinned`
- `tags`
- `linkedTasks`

### ActivityLogs
- `user`
- `type`
- `message`
- `metadata`

### AIInsights
- `user`
- `type`
- `title`
- `summary`
- `payload`

### Habits
- `user`
- `title`
- `cadence`
- `trigger`
- `successCount`
- `aiSuggested`

### ProductivityMetrics
- `user`
- `date`
- `completionRate`
- `completedTasks`
- `overdueTasks`
- `productivityScore`
- `focusMinutes`
- `slotBreakdown`

## 3. Backend Architecture and API Design

### Backend layout
- `config/`: environment and Mongo connection
- `models/`: Mongoose schemas
- `controllers/`: request handling
- `routes/`: public and protected API registration
- `services/`: dashboard analytics, AI orchestration, activity logging
- `middleware/`: auth, validation, centralized error handling
- `utils/`: JWT, planners, role config, productivity helpers
- `validations/`: `express-validator` rules

### Auth APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Task APIs
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle-complete`
- `PATCH /api/tasks/:id/toggle-important`
- `PATCH /api/tasks/:id/duplicate`
- `PATCH /api/tasks/reorder`

### Note APIs
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `PATCH /api/notes/:id/pin`

### Dashboard and analytics APIs
- `GET /api/dashboard/summary`
- `GET /api/analytics/weekly`
- `GET /api/analytics/insights`

### AI APIs
- `POST /api/ai/breakdown-task`
- `POST /api/ai/plan-day`
- `POST /api/ai/reschedule`
- `POST /api/ai/productivity-score`
- `POST /api/ai/habit-suggestions`
- `POST /api/ai/future-roadmap`
- `POST /api/ai/voice-to-task`

## 4. Frontend Architecture and Component/Page Structure

### Core structure
- `api/`: Axios clients per domain
- `context/`: auth and persistent session state
- `layouts/`: dashboard shell and responsive nav
- `pages/`: landing, auth, dashboard, tasks, planner, notes, analytics, settings, roadmap
- `components/common/`: base UI primitives
- `components/dashboard/`: charts and AI summary cards
- `components/tasks/`: quick add, sortable cards, advanced drawer
- `components/planner/`: day-slot columns and AI controls
- `components/notes/`: note cards and TipTap editor
- `routes/`: protected route guard

### Main pages
- Landing page with SaaS hero and CTA
- Login and registration with onboarding role selection
- Dashboard with charts, stats, AI insights, focus tasks, deadlines, and activity
- Tasks page for basic and advanced task modes
- Planner page for AI breakdown, voice input, daily planning, and rescheduling
- Notes page with rich text editing and pinning
- Analytics page with weekly trends and consistency guidance
- Settings page for role, life mode, theme, and productivity preferences
- Roadmap page for future-you simulation

## 5. Backend Code File by File

The backend is implemented in `backend/src` and is already organized file-by-file in the repository. The most important entry points are:

- `src/app.js`: Express middleware, security, route registration
- `src/server.js`: bootstraps DB and server
- `src/services/aiService.js`: prompt building, backend-only OpenAI calls, strict JSON parsing, fallback logic
- `src/services/dashboardService.js`: summary aggregation
- `src/services/analyticsService.js`: analytics computations
- `src/controllers/*.js`: auth, task, notes, dashboard, analytics, AI handlers
- `src/models/*.js`: Mongoose data model layer
- `src/data/seed.js`: sample data seeding

## 6. Frontend Code File by File

The frontend is implemented in `frontend/src` and is also fully organized file-by-file. The main entry points are:

- `src/main.jsx`: React bootstrap and providers
- `src/App.jsx`: router tree
- `src/context/AuthContext.jsx`: login, registration, session bootstrap, profile updates
- `src/layouts/DashboardLayout.jsx`: premium responsive shell
- `src/pages/*.jsx`: route-level pages
- `src/components/tasks/*.jsx`: quick add, drag-and-drop task cards, advanced drawer
- `src/components/notes/*.jsx`: rich text note experience
- `src/components/dashboard/*.jsx`: chart and insight modules
- `src/api/*.js`: frontend API wrappers

## 7. AI Integration Code

AI is backend-only and lives in `backend/src/services/aiService.js`.

### AI behavior included
- Strict JSON requests
- Role-aware prompt shaping
- Backend secret usage through `.env`
- Safe JSON parsing
- Graceful fallback logic when AI is unavailable
- Output normalization before frontend use
- Insight persistence through `AIInsight`

### Implemented AI features
- Goal breakdown
- Smart daily planning
- Auto-rescheduling
- Productivity scoring
- Habit suggestions
- Future roadmap generation
- Voice-to-task parsing

## 8. README and Setup Instructions

### Backend setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Seed sample data
```bash
cd backend
npm run seed
```

Seed user:

- Email: `alex@example.com`
- Password: `password123`

## 9. How to Run Locally

1. Start MongoDB locally, or use a MongoDB Atlas connection string.
2. In `backend/.env`, set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `OPENAI_API_KEY`
3. In `frontend/.env`, set `VITE_API_URL=http://localhost:5000/api`
4. Run the backend with `npm run dev`
5. Run the frontend with `npm run dev`
6. Open the Vite URL, usually `http://localhost:5173`

## 10. Deployment Guide

### Frontend on Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `VITE_API_URL=<your-render-api-url>/api`

### Backend on Render
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Env vars:
  - `PORT`
  - `NODE_ENV=production`
  - `CLIENT_URL=<your-vercel-url>`
  - `MONGODB_URI=<atlas-uri>`
  - `JWT_SECRET=<secure-secret>`
  - `OPENAI_API_KEY=<secret>`
  - `OPENAI_MODEL=gpt-4.1-mini`

### MongoDB Atlas
- Create a shared or dedicated cluster
- Add the Render outbound IP or allow trusted access as needed
- Set the connection string in `MONGODB_URI`

## Notes

- AI is an enhancement, not a blocker. The fallback planner and fallback breakdown logic keep the core experience usable even without an AI response.
- The task UI is intentionally dual-mode: quick add for normal to-do usage, advanced drawer for richer productivity fields.
- The backend is ready for future reminder workers, browser notification wiring, and export/import expansion.
