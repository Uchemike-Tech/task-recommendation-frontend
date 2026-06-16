# Backend Fallback Configuration - Setup Guide

## Overview
Your frontend is now configured with an **automatic backend fallback mechanism**. This means:

- **Primary Backend**: Render (https://task-recommendation-backend.onrender.com)
- **Fallback Backend**: Streamlit (https://task-recommendation-backend.streamlit.app)

If the primary backend fails for any reason, the application will automatically switch to the fallback backend without user intervention.

---

## What Changed

### 1. Enhanced API Module (`src/utils/api.js`)
The API utility has been updated with:

- **Dual backend configuration** - Primary (Render) and Fallback (Streamlit)
- **Automatic failover** - Tries primary first, switches to fallback on failure
- **Smart error handling** - Logs which backend is being used
- **8-second timeout** - Prevents long waits before attempting fallback
- **Token management** - Preserves authentication across both backends

### 2. Environment Configuration (`.env.example`)
Template file for easy configuration:
```env
REACT_APP_PRIMARY_BACKEND=https://task-recommendation-backend.onrender.com
REACT_APP_FALLBACK_BACKEND=https://task-recommendation-backend.streamlit.app
REACT_APP_API_TIMEOUT=8000
```

---

## How It Works

### Normal Flow (Primary Backend Available)
```
User Action 
    ↓
Make API Request (Primary/Render)
    ↓
Success ✅
    ↓
Return Response
```

### Fallback Flow (Primary Backend Down)
```
User Action 
    ↓
Make API Request (Primary/Render)
    ↓
Timeout or Error ❌
    ↓
⚠️ Log: "Primary backend failed, attempting fallback..."
    ↓
Make API Request (Fallback/Streamlit)
    ↓
Success ✅
    ↓
✅ Log: "Using fallback backend"
    ↓
Return Response
```

---

## Setup Instructions

### Step 1: Create `.env` File
Copy `.env.example` to `.env` in your project root:

```bash
cp .env.example .env
```

Your `.env` file will look like:
```env
REACT_APP_PRIMARY_BACKEND=https://task-recommendation-backend.onrender.com
REACT_APP_FALLBACK_BACKEND=https://task-recommendation-backend.streamlit.app
REACT_APP_API_TIMEOUT=8000
```

### Step 2: Restart Development Server
If running locally:
```bash
npm start
```

The dev server will reload and pick up the new environment variables.

### Step 3: Test the Fallback (Optional)
To test the fallback mechanism:

1. **Open Browser DevTools** (F12 or Cmd+Option+I)
2. **Go to Network tab**
3. **Enable offline mode** or throttle network to "Offline"
4. **Trigger an API call** (e.g., log in, load tasks)
5. **Check Console** for logs like:
   - `⚠️ Primary backend failed, attempting fallback...`
   - `✅ Using fallback backend: /login`

---

## Console Logs Reference

The application logs helpful messages to help you understand what's happening:

| Log | Meaning |
|-----|---------|
| `✅ Using fallback backend: /endpoint` | Successfully switched to Streamlit backend |
| `⚠️ Primary backend failed, attempting fallback...` | Primary (Render) failed, trying Streamlit |
| `❌ Both backends failed...` | Both backends are unavailable |
| `🔄 Backend reset to primary` | Backend was reset to primary (on app startup) |

**To view logs:**
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Perform an API action (login, load tasks)

---

## API Endpoints Using Fallback

All these API endpoints now support automatic fallback:

### Authentication
- `POST /login` - User login
- `POST /register` - User registration

### Tasks
- `GET /tasks` - Fetch all tasks
- `PUT /tasks/{taskId}/complete` - Mark task as complete
- `POST /reset_tasks` - Reset all tasks

### Recommendations
- `GET /recommendation` - Get AI recommendation

### Profile
- `GET /profile` - Get user profile

---

## Important Notes

### ⚠️ CORS Requirements
Both backends MUST have CORS enabled to allow requests from your frontend domain. If you get CORS errors, contact your backend team to add:

```
Access-Control-Allow-Origin: https://your-frontend-url.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 🔐 Authentication Token
The authentication token is stored in `localStorage` and will be sent to whichever backend is active. This means:
- If you login on Render, the token works on Streamlit
- Sessions are NOT device-specific, they're user-specific

### 📝 Error Handling
If **both backends fail**:
- User will see an error message
- Check your internet connection
- Verify both backend URLs are correct
- Check backend deployment status

### 🔄 Manual Backend Reset
If needed, you can manually reset to primary backend by adding this to your app initialization:

```javascript
import { resetBackend } from './utils/api';

// On app startup
resetBackend();
```

---

## Monitoring & Debugging

### Check Active Backend
To see which backend is currently active:

```javascript
import { getCurrentBackend } from './utils/api';

console.log('Active backend:', getCurrentBackend());
// Output: https://task-recommendation-backend.onrender.com (or streamlit URL)
```

### Deployment Scenarios

| Scenario | Result |
|----------|--------|
| Render ✅ Streamlit ✅ | Uses Render (primary) |
| Render ❌ Streamlit ✅ | Uses Streamlit (fallback) |
| Render ✅ Streamlit ❌ | Uses Render (primary) |
| Render ❌ Streamlit ❌ | Error - Both unavailable |

---

## Troubleshooting

### Issue: "Both backends failed"
**Solution:**
1. Check internet connection
2. Verify backend URLs in `.env`
3. Check if Render deployment is running: https://task-recommendation-backend.onrender.com/health
4. Check if Streamlit is running: https://task-recommendation-backend.streamlit.app/health

### Issue: Long loading times
**Solution:**
1. Increase `REACT_APP_API_TIMEOUT` in `.env` (default 8000ms = 8 seconds)
2. Check network speed
3. Check backend response times

### Issue: Session lost after fallback
**Solution:**
1. Re-login (tokens should transfer)
2. Check browser localStorage has token: Open DevTools → Application → LocalStorage
3. Ensure both backends have same database

---

## Next Steps

1. ✅ **Verify `.env` file created** in project root
2. ✅ **Restart dev server** to load environment variables
3. ✅ **Test locally** by triggering API calls
4. ✅ **Test fallback** by simulating network issues
5. ✅ **Deploy to production** with same configuration

---

## Questions?

- **Check console logs** for detailed error messages
- **Verify backend URLs** match your deployments
- **Test CORS** by visiting backend URLs directly in browser
- **Contact backend team** if endpoints have different paths

---

**Last Updated**: 2026-06-16  
**Files Modified**: `src/utils/api.js`, `.env.example` created
