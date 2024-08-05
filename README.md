# Poll Dashboard

Poll Dashboard is a real-time polling application built with React and Vite. It allows users to create polls, participate in them, and view results in real-time.

## Features

1. **User Authentication**: Secure login and registration system.
2. **Protected Routes**: Certain routes are only accessible to authenticated users.
3. **Poll Creation**: Authenticated users can create new polls.
4. **Real-time Polling**: Users can participate in polls in real-time.
5. **Poll Results**: View live updated results of polls.

## Technology Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit for state management
- React Router for routing
- Axios for API requests
- Socket.io for real-time updates
- Tailwind CSS for styling
- Recharts for data visualization
- React Hook Form for form handling
- Zod for schema validation

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/poll-dashboard.git
   cd poll-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview the production build locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.