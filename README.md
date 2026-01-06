# Notes App

A modern, offline-first notes application built with Next.js 16, featuring real-time synchronization, user authentication, and a responsive design. Create, manage, and sync your notes seamlessly across devices with automatic offline support.

## Features

- **Offline-First Architecture**: Create and manage notes even without an internet connection using PouchDB for local storage
- **Real-Time Synchronization**: Automatic bidirectional sync with Supabase when online
- **User Authentication**: Secure signup, login, and session management powered by Supabase Auth
- **Responsive Design**: Fully responsive UI with collapsible sidebar and mobile-optimized navigation
- **Dark Mode Support**: Built-in theme switching capability using next-themes
- **Online Status Indicator**: Real-time connectivity status display
- **Toast Notifications**: User-friendly feedback for all operations
- **Modern UI Components**: Pre-built components from shadcn/ui with Radix UI primitives
- **Smooth Animations**: Enhanced user experience with Framer Motion

## Architecture

### Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Re-usable component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev) - Icon library

**Backend & Services:**
- [Supabase](https://supabase.com) - Authentication and backend services
- [PouchDB](https://pouchdb.com) - Client-side database for offline storage

**State Management & Utilities:**
- React Context API - Authentication state management
- [Sonner](https://sonner.emilkowal.ski) - Toast notifications
- Custom hooks for online status detection

### System Design

The application follows an **offline-first architecture**:

1. **Local Storage Layer**: All notes are stored locally in PouchDB (IndexedDB)
2. **Synchronization Layer**: Bidirectional sync between PouchDB and Supabase
3. **Authentication Layer**: Supabase Auth with SSR support for secure session management
4. **UI Layer**: Client-side rendered React components with optimistic updates

```
┌─────────────────────────────────────────┐
│           User Interface                │
│  (React Components + Tailwind CSS)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Application Logic Layer            │
│  (React Hooks + Context Providers)      │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌──────▼──────┐
│  PouchDB   │◄──┤    Sync     │
│  (Local)   │   │   Service   │
└────────────┘   └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │  Supabase   │
                 │  (Remote)   │
                 └─────────────┘
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **Git**

You'll also need:
- A [Supabase](https://supabase.com) account and project
- Supabase project URL and anon key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   In your Supabase project, create the following table:

   ```sql
   -- Create notes table
   CREATE TABLE notes (
     id TEXT PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT,
     content TEXT,
     updated_at BIGINT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

   -- Create policy for users to only see their own notes
   CREATE POLICY "Users can view their own notes"
     ON notes FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own notes"
     ON notes FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own notes"
     ON notes FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own notes"
     ON notes FOR DELETE
     USING (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

### Authentication Flow

1. User signs up or logs in through the authentication pages
2. Supabase creates a session and returns a JWT token
3. The AuthProvider manages the user session state throughout the app
4. Protected routes automatically redirect unauthenticated users to login

### Note Management Flow

1. **Creating a Note**:
   - User creates a note in the UI
   - Note is immediately saved to PouchDB (local)
   - If online, sync process pushes the note to Supabase
   - Optimistic UI updates show the note instantly

2. **Syncing Notes**:
   - **Push**: Local PouchDB notes are pushed to Supabase
   - **Pull**: Remote Supabase notes are pulled to PouchDB
   - Automatic sync occurs when:
     - User comes online (online event listener)
     - User manually triggers sync
     - Initial page load

3. **Offline Support**:
   - All notes are stored locally in PouchDB
   - Users can create, view, and edit notes offline
   - Changes sync automatically when connection is restored

## Project Structure

```
notes-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (app)/               # Authenticated routes group
│   │   │   ├── layout.tsx       # App layout with sidebar
│   │   │   └── notes/           # Notes page
│   │   │       ├── page.tsx     # Server component
│   │   │       └── NotesClient.tsx  # Client component
│   │   ├── (auth)/              # Authentication routes group
│   │   │   ├── login/           # Login page
│   │   │   └── signup/          # Signup page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Sidebar/             # Sidebar component
│   │   └── LogoutButton/        # Logout button
│   ├── lib/                     # Utility functions
│   │   ├── pouch/              # PouchDB setup and operations
│   │   │   ├── createDB.ts     # Database initialization
│   │   │   ├── notes.ts        # Note CRUD operations
│   │   │   ├── types.ts        # Type definitions
│   │   │   └── db.ts           # Database configuration
│   │   ├── supabase/           # Supabase client setup
│   │   │   ├── client.ts       # Browser client
│   │   │   └── server.ts       # Server client
│   │   ├── sync/               # Synchronization logic
│   │   │   ├── syncNotes.ts    # Main sync orchestrator
│   │   │   ├── pushNotes.ts    # Push to Supabase
│   │   │   ├── pullNotes.ts    # Pull from Supabase
│   │   │   └── syncState.ts    # Sync state management
│   │   └── utils.ts            # Helper utilities
│   ├── hooks/                   # Custom React hooks
│   │   └── useOnlineStatus.tsx # Online/offline detection
│   └── providers/               # React Context providers
│       └── auth-provider.tsx   # Authentication context
├── public/                      # Static assets
├── .env.local                   # Environment variables (not in git)
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── README.md                   # This file
```

## Development

### Available Scripts

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code
pnpm format
```

### Code Quality

The project uses:
- **Biome** for linting and formatting
- **TypeScript** for type checking
- **ESLint** rules via Biome

### Adding New Features

1. **Adding a new UI component**:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Creating new PouchDB operations**:
   - Add functions to `src/lib/pouch/notes.ts`
   - Update types in `src/lib/pouch/types.ts`

3. **Adding sync logic**:
   - Modify `src/lib/sync/` directory files
   - Ensure bidirectional sync is maintained

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project on [Vercel](https://vercel.com)

3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Troubleshooting

### Notes not syncing

- Check your internet connection
- Verify Supabase environment variables are correct
- Check browser console for sync errors
- Ensure Supabase Row Level Security policies are properly configured

### Authentication issues

- Clear browser cookies and local storage
- Verify Supabase URL and anon key
- Check Supabase Auth settings (email confirmation, etc.)

### PouchDB errors

- Clear browser IndexedDB data
- Check browser compatibility (PouchDB requires IndexedDB support)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the repository.
