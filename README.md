# Polar Desk

A client project management dashboard built with Next.js and Supabase. Manage projects, track progress with milestones, share files with clients, and provide a dedicated client portal via magic links.

---

## Project Overview

Polar Desk is a web application designed for agencies and freelancers to manage client projects. It provides:

- **Project Management**: Create and organize client projects with deadlines, status tracking, and client details
- **Progress Tracking**: Define project milestones/steps and mark them as complete to visualize progress
- **File Sharing**: Upload and manage project files that are accessible to clients
- **Client Portal**: Generate unique magic links that give clients read-only access to their project progress and files
- **Authentication**: Secure Google OAuth authentication for dashboard access

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.15 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 6.0.2 | Type safety |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| Supabase | ^2.103.3 | Backend, database, auth, and storage |
| @tailwindcss/postcss | ^4.2.2 | Tailwind PostCSS plugin |

---

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── dashboard/
│   │   ├── page.tsx              # Redirects to /dashboard/projects
│   │   ├── projects/
│   │   │   └── page.tsx          # Main project management UI
│   │   └── massage/
│   │       └── page.tsx          # Placeholder page example
│   ├── project/
│   │   └── [token]/
│   │       └── page.tsx          # Public client portal page
│   ├── login/
│   │   └── page.tsx              # Login page with Google OAuth
│   ├── signup/
│   │   └── page.tsx              # Signup page with Google OAuth
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Root redirect to dashboard
│   └── globals.css               # Global styles and CSS variables
├── components/
│   ├── AuthGuard.tsx             # Authentication wrapper component
│   ├── AuthPageShell.tsx         # Shared auth page layout
│   └── Sidebar.tsx               # Dashboard navigation sidebar
├── src/
│   └── lib/
│       └── supabaseClient.ts     # Supabase client initialization
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind content paths
└── .env.local                    # Environment variables (not committed)
```

---

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm or another package manager
- A Supabase account (free tier works)
- A Google Cloud project (for OAuth)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd polar-desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in the values (see Environment Variables section below).

4. **Set up Supabase**
   
   Follow the Supabase Setup section below to configure your database tables and storage.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to `http://localhost:3000` in your browser.

---

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Required | Description | How to Obtain |
|----------|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous/public API key | Supabase Dashboard > Project Settings > API |

**Example `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Important:**
- The `NEXT_PUBLIC_` prefix is required for client-side access
- Never commit `.env.local` to version control
- For production, set these variables in your hosting platform

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Project Settings > API

### 2. Enable Google OAuth (Authentication)

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Configure your Google OAuth credentials (see Google Cloud Console setup)
4. Add your redirect URLs:
   - Development: `http://localhost:3000/dashboard`
   - Production: `https://your-domain.com/dashboard`

### 3. Database Tables

Run the following SQL in Supabase Dashboard > SQL Editor:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Review', 'Completed')),
  progress_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project steps table (milestones)
CREATE TABLE project_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  expected_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project files table
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Magic links table (for client portal access)
CREATE TABLE magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Project steps policies
CREATE POLICY "Users can view steps of their projects"
  ON project_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_steps.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert steps to their projects"
  ON project_steps FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_steps.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update steps of their projects"
  ON project_steps FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_steps.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete steps of their projects"
  ON project_steps FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_steps.project_id AND projects.user_id = auth.uid()
  ));

-- Project files policies
CREATE POLICY "Users can view files of their projects"
  ON project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert files to their projects"
  ON project_files FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete files of their projects"
  ON project_files FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid()
  ));

-- Magic links policies
CREATE POLICY "Users can view magic links of their projects"
  ON magic_links FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = magic_links.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert magic links for their projects"
  ON magic_links FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = magic_links.project_id AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete magic links of their projects"
  ON magic_links FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects WHERE projects.id = magic_links.project_id AND projects.user_id = auth.uid()
  ));

-- Allow public read access to projects via magic links
CREATE POLICY "Public can view projects via magic link"
  ON projects FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM magic_links 
    WHERE magic_links.project_id = projects.id 
    AND (magic_links.expires_at IS NULL OR magic_links.expires_at > now())
  ));

-- Allow public read access to project steps via magic links
CREATE POLICY "Public can view steps via magic link"
  ON project_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM magic_links 
    WHERE magic_links.project_id = project_steps.project_id 
    AND (magic_links.expires_at IS NULL OR magic_links.expires_at > now())
  ));

-- Allow public read access to project files via magic links
CREATE POLICY "Public can view files via magic link"
  ON project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM magic_links 
    WHERE magic_links.project_id = project_files.project_id 
    AND (magic_links.expires_at IS NULL OR magic_links.expires_at > now())
  ));
```

### 4. Storage Bucket Setup

1. In Supabase Dashboard, go to Storage
2. Create a new bucket named `project-files`
3. Set the bucket to **Public** (files will be accessed via public URLs)
4. Add the following storage policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-files');

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-files');

-- Allow public read access to files
CREATE POLICY "Public can read files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-files');
```

---

## Core Functionality

### Project Creation

1. Navigate to `/dashboard/projects`
2. Click "New Project"
3. Fill in project details:
   - Project Name
   - Client Name
   - Client Email
   - Deadline (optional)
   - Status (In Progress, Review, Completed)
4. Add progress steps/milestones
5. Upload files via drag-and-drop or file input
6. Save the project

**On save:**
- Project is saved to the `projects` table
- Steps are saved to the `project_steps` table
- Files are uploaded to Supabase Storage and metadata saved to `project_files`
- A magic link is automatically generated and stored in `magic_links`

### Progress Steps

Each project can have multiple progress steps:
- Steps have a name, expected date, and completion status
- Steps can be marked complete/incomplete by clicking the checkbox
- Progress percentage is calculated automatically based on completed steps
- Steps can be added, edited, or removed from the project modal

### File Upload and Retrieval

Files are stored in the `project-files` Supabase Storage bucket:
- Files are organized by user ID and project ID: `{userId}/{projectId}/{filename}`
- Public URLs are generated for file access
- File metadata (name, URL) is stored in the `project_files` table
- Files appear in both the dashboard and client portal

### Magic Link System (Client Portal)

The magic link system provides clients read-only access to their projects:

1. When a new project is created, a unique token is generated
2. The magic link format is: `https://your-domain.com/project/{token}`
3. The client portal (`/project/[token]`) displays:
   - Project progress with visual progress bar
   - List of steps with completion status
   - Shared files with download links
   - A placeholder chat interface (not yet functional)

**Token resolution:**
- The system first checks if the token exists in the `magic_links` table
- If not found, it treats the token as a direct project ID
- Expired magic links (past `expires_at` date) will show an error page

**To copy a magic link:**
- In the project list, click "Copy link" next to any project
- Or view the project and copy the displayed magic link

---

## Deployment Guide

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import the project in Vercel:
   - Go to [vercel.com](https://vercel.com) and create a new project
   - Import your repository
   - Select the "Next.js" framework preset

3. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your production Supabase URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your production anon key

4. Update Supabase OAuth settings:
   - In Supabase Dashboard, add your production domain to the redirect URLs
   - Format: `https://your-domain.com/dashboard`

5. Deploy

### Other Hosting Platforms

For other platforms (Netlify, Railway, etc.):

1. Build the application:
   ```bash
   npm run build
   ```

2. Ensure environment variables are available at build time

3. Deploy the `.next` folder and required files

---

## Notes and Assumptions

### Current Limitations

1. **Email/Password Authentication**: The UI for email/password login and signup exists, but the actual email/password authentication is not fully implemented. Only Google OAuth is functional.

2. **Chat Interface**: The client portal includes a chat UI, but it is not connected to a real-time messaging system. Messages are hardcoded for demonstration purposes.

3. **File Download All**: The "Download All" button in the client portal is not implemented.

4. **Undo Delete**: The undo functionality for project deletion clears the timer but does not restore the deleted project if the deletion has already executed.

### Important Considerations

1. **Storage Costs**: Files are stored in Supabase Storage which may incur costs based on usage. Monitor your storage usage if handling many or large files.

2. **Magic Link Expiration**: Magic links expire after 30 days by default. This is set in the `saveProject` function in `/app/dashboard/projects/page.tsx`.

3. **File Access**: Files are stored in a public bucket with public URLs. Anyone with the URL can access the file. If private files are needed, additional access controls must be implemented.

4. **Database Relationships**: All tables have CASCADE DELETE relationships with the `projects` table. Deleting a project will automatically delete all associated steps, files, and magic links.

5. **User Isolation**: Projects are isolated by `user_id`. Users can only see and manage their own projects due to Row Level Security policies.

### Development Notes

- The project uses Tailwind CSS v4 with the new `@import "tailwindcss"` syntax
- The sidebar is responsive: hidden on mobile, fixed on desktop
- The massage page at `/dashboard/massage` is a placeholder and can be replaced or removed
- The primary brand color is `#3525CD` (indigo/purple)

### Required Files

The application expects a logo file at `/public/logo.png`. Add this file to your project or update the references in:
- `/app/layout.tsx`
- `/components/AuthPageShell.tsx`
- `/components/Sidebar.tsx`

### Troubleshooting

**Issue: Files not uploading**
- Check that the `project-files` bucket exists in Supabase Storage
- Verify storage policies allow authenticated inserts
- Check browser console for error messages

**Issue: Magic links not working**
- Verify the `magic_links` table exists and has the correct schema
- Check that RLS policies allow public access via magic links
- Ensure the token in the URL matches a record in the table

**Issue: Google OAuth not working**
- Verify redirect URLs are correctly configured in Supabase
- Ensure the Google OAuth credentials are valid
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
