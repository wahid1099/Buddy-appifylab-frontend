# BuddyScript Frontend

A modern, responsive social media interface built with React 19 and Vite. This application provides a seamless user experience for connecting with friends, sharing posts, and managing your profile.

## Features

- **News Feed**: Infinite scrolling feed of posts from you and your network.
- **Post Creation**: Create posts with text and image support.
- **Interactions**: Like and comment on posts. Reply to comments.
- **User Profiles**:
  - Customizable profile page with cover photo and avatar.
  - Bio and stats (posts, followers, following).
  - Tabbed view for Posts, Followers, and Following lists.
  - Follow/Unfollow functionality.
- **Dark Mode**: Fully integrated dark mode with a toggle switcher.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Authentication**: Secure login and registration with JWT handling.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Styling**: CSS Modules & Global CSS Variables (Theming)
- **Linting**: ESLint

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Create a `.env` file in the root directory (or copy `.env.example` if available).
   - Add the backend API URL:
     ```
     VITE_API_URL=https://buddy-appifylab-backend.vercel.app/api
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5173` (or the next available port).

## Project Structure

```
src/
├── assets/
│   ├── css/             # Global styles and variables
│   └── images/          # Static images
├── components/
│   ├── common/          # Reusable components (Navbar, Button, etc.)
│   ├── feed/            # Feed-related components (Post, Comment, etc.)
│   └── profile/         # Profile-related components (Header, Stats, Tabs)
├── context/
│   └── AuthContext.jsx  # Authentication state management
├── pages/
│   ├── Feed.jsx         # Main feed page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   └── Profile.jsx      # User profile page
├── services/
│   └── api.js           # Axios instance and API methods
├── App.jsx              # Main application component & routing
└── main.jsx             # Entry point
```

## Key Components

- **AuthContext**: Manages user session and provides `login`, `logout`, and `user` state throughout the app.
- **ProtectedRoute**: A wrapper component that redirects unauthenticated users to the login page.
- **ThemeSwitcher**: Toggles between light and dark modes by updating CSS variables on the `<body>` element.

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## License

ISC
