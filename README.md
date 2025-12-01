# Traffic Test Site

A simple static website for testing distributed traffic simulation tools and viewing analytics/fingerprinting data.

## Features

- 5 pages with lorem ipsum content
- Embedded YouTube videos
- External links to various domains
- Random images from picsum.photos
- Comprehensive analytics tracking via JavaScript
- Fingerprinting data collection (canvas, WebGL, fonts, etc.)

## What Gets Tracked

The analytics script collects:
- **Browser**: User agent, platform, language, cookie settings
- **Screen**: Resolution, color depth, viewport size
- **Device**: Memory, CPU cores, touch points
- **Network**: Connection type, speed, RTT
- **Fingerprints**: Canvas, WebGL renderer
- **Fonts**: Detected system fonts
- **Performance**: Page load times
- **Interactions**: Click tracking with coordinates

All data is logged to the browser console and stored in localStorage.

## Free Deployment Options

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all files maintaining the directory structure
3. Go to Settings → Pages
4. Select branch (main) and root folder
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Option 2: Netlify

1. Sign up at netlify.com
2. Drag and drop the entire `test-site` folder
3. Instant deployment with custom URL
4. Optional: Connect to GitHub for auto-deploys

### Option 3: Vercel

1. Sign up at vercel.com
2. Import the project
3. Deploy with one click
4. Get a vercel.app subdomain

### Option 4: Cloudflare Pages

1. Sign up at pages.cloudflare.com
2. Connect your GitHub repo
3. Deploy directly from repo
4. Free with Cloudflare CDN

## Testing Your Traffic Sim

Once deployed, point your traffic simulator at:
- `https://yoursite.com/` (home)
- `https://yoursite.com/about.html`
- `https://yoursite.com/services.html`
- `https://yoursite.com/blog.html`
- `https://yoursite.com/contact.html`

Open browser DevTools Console to see real-time tracking data, or check localStorage for stored visit data.

## Viewing Analytics Data

Open browser console (F12) to see:
1. Full visitor data object on page load
2. Click tracking events
3. Visibility changes
4. Page unload events

Or check localStorage:
```javascript
// View last visit data
console.log(JSON.parse(localStorage.getItem('lastVisit')));

// View all visits
console.log(JSON.parse(localStorage.getItem('visits')));
```

## Customization

To add more tracking endpoints, modify `js/analytics.js` to send data to your backend:

```javascript
fetch('https://your-backend.com/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

## File Structure

```
test-site/
├── index.html
├── about.html
├── services.html
├── blog.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── analytics.js
└── README.md
```

## Notes

- All external resources (images, videos) are loaded from CDNs
- No backend required - pure static HTML/CSS/JS
- Analytics data stays client-side by default
- Green "Analytics Active" indicator shows tracking is working
