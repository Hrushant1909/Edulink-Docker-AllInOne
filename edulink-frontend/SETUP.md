# Setup Instructions

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   Create a `.env` file in the root directory with:
   ```env
   VITE_API_BASE_URL=http://localhost:8075
   ```
   Update the URL if your backend runs on a different port.

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8075` |

## Backend Connection

Make sure your backend is running and accessible at the URL specified in `VITE_API_BASE_URL`. The frontend will make API calls to:

- `{VITE_API_BASE_URL}/api/auth/*` - Authentication endpoints
- `{VITE_API_BASE_URL}/api/admin/*` - Admin endpoints
- `{VITE_API_BASE_URL}/api/teacher/*` - Teacher endpoints
- `{VITE_API_BASE_URL}/api/student/*` - Student endpoints

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend allows requests from the frontend origin (usually `http://localhost:5173`).

### Authentication Not Working
- Check that the backend is running
- Verify the `VITE_API_BASE_URL` in `.env` is correct
- Check browser console for errors
- Ensure JWT tokens are being stored in localStorage

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`

