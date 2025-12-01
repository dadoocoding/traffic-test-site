//const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0JNo1eYXx_HAQWbD0-634xb3QNG67fjF-TiaTqfu_w08X9gT8E8-MChvqHguvq-io/exec';
(function() {
    'use strict';

    // CONFIGURATION: Replace this with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0JNo1eYXx_HAQWbD0-634xb3QNG67fjF-TiaTqfu_w08X9gT8E8-MChvqHguvq-io/exec';
    
    // Set to false to disable Google Sheets logging (will only log locally)
    const ENABLE_REMOTE_LOGGING = true;

    // Session tracking variables
    let pageLoadTime = Date.now();
    let sessionStartTime = getSessionStartTime();
    let lastActivityTime = Date.now();
    
    // Get or create session start time
    function getSessionStartTime() {
        const stored = sessionStorage.getItem('sessionStartTime');
        if (stored) {
            return parseInt(stored);
        } else {
            const now = Date.now();
            sessionStorage.setItem('sessionStartTime', now.toString());
            return now;
        }
    }

    // Collect visitor data
    function collectData() {
        const now = Date.now();
        const timeOnPage = Math.round((now - pageLoadTime) / 1000); // seconds
        const sessionDuration = Math.round((now - sessionStartTime) / 1000); // seconds
        
        const data = {
            // Timestamp
            timestamp: new Date().toISOString(),
            
            // Duration tracking
            timeOnPage: timeOnPage,
            sessionDuration: sessionDuration,
            sessionStartTime: new Date(sessionStartTime).toISOString(),
            
            // Page info
            url: window.location.href,
            referrer: document.referrer,
            title: document.title,
            
            // Browser info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            
            // Screen info
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            screenColorDepth: window.screen.colorDepth,
            screenPixelDepth: window.screen.pixelDepth,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            
            // Device info
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            
            // Connection info
            connection: {
                effectiveType: navigator.connection?.effectiveType || 'unknown',
                downlink: navigator.connection?.downlink || 'unknown',
                rtt: navigator.connection?.rtt || 'unknown',
                saveData: navigator.connection?.saveData || false
            },
            
            // Timezone
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // Plugins (limited in modern browsers)
            pluginsCount: navigator.plugins.length,
            
            // Session info
            sessionStorage: typeof sessionStorage !== 'undefined',
            localStorage: typeof localStorage !== 'undefined',
            indexedDB: typeof indexedDB !== 'undefined',
            
            // Canvas fingerprint
            canvasFingerprint: getCanvasFingerprint(),
            
            // WebGL fingerprint
            webglFingerprint: getWebGLFingerprint(),
            
            // Fonts
            fonts: detectFonts(),
            
            // Performance
            performance: {
                navigation: performance.navigation?.type || 'unknown',
                timing: {
                    loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 'unknown',
                    domReady: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart || 'unknown'
                }
            }
        };
        
        return data;
    }
    
    // Canvas fingerprinting
    function getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 50;
            
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Hello, World!', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Hello, World!', 4, 17);
            
            return canvas.toDataURL().substring(0, 100); // Truncate for brevity
        } catch (e) {
            return 'unavailable';
        }
    }
    
    // WebGL fingerprinting
    function getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) return 'unavailable';
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
            };
        } catch (e) {
            return 'unavailable';
        }
    }
    
    // Font detection
    function detectFonts() {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 
            'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 
            'Trebuchet MS', 'Impact'
        ];
        
        const detected = [];
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const testString = 'mmmmmmmmmmlli';
        const testSize = '72px';
        
        const baseWidths = {};
        baseFonts.forEach(baseFont => {
            ctx.font = testSize + ' ' + baseFont;
            baseWidths[baseFont] = ctx.measureText(testString).width;
        });
        
        testFonts.forEach(font => {
            let detected_font = false;
            baseFonts.forEach(baseFont => {
                ctx.font = testSize + ' ' + font + ',' + baseFont;
                const width = ctx.measureText(testString).width;
                if (width !== baseWidths[baseFont]) {
                    detected_font = true;
                }
            });
            if (detected_font) {
                detected.push(font);
            }
        });
        
        return detected;
    }
    
    // Send data to Google Sheets
    function sendToGoogleSheets(data) {
        if (!ENABLE_REMOTE_LOGGING) {
            console.log('Remote logging disabled');
            return Promise.resolve();
        }
        
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.warn('Google Sheets URL not configured. Skipping remote logging.');
            return Promise.resolve();
        }
        
        // Flatten nested objects for easier Google Sheets storage
        const flatData = {
            timestamp: data.timestamp,
            timeOnPage: data.timeOnPage,
            sessionDuration: data.sessionDuration,
            sessionStartTime: data.sessionStartTime,
            url: data.url,
            referrer: data.referrer,
            title: data.title,
            userAgent: data.userAgent,
            platform: data.platform,
            language: data.language,
            cookieEnabled: data.cookieEnabled,
            screenWidth: data.screenWidth,
            screenHeight: data.screenHeight,
            screenColorDepth: data.screenColorDepth,
            viewportWidth: data.viewportWidth,
            viewportHeight: data.viewportHeight,
            deviceMemory: data.deviceMemory,
            hardwareConcurrency: data.hardwareConcurrency,
            maxTouchPoints: data.maxTouchPoints,
            connectionType: data.connection.effectiveType,
            connectionDownlink: data.connection.downlink,
            connectionRTT: data.connection.rtt,
            timezone: data.timezone,
            timezoneOffset: data.timezoneOffset,
            canvasFingerprint: data.canvasFingerprint,
            webglVendor: data.webglFingerprint.vendor || 'unknown',
            webglRenderer: data.webglFingerprint.renderer || 'unknown',
            fontsDetected: data.fonts.join(', '),
            fontsCount: data.fonts.length,
            loadTime: data.performance.timing.loadTime,
            domReady: data.performance.timing.domReady
        };
        
        return fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flatData)
        })
        .then(() => {
            console.log('✅ Data sent to Google Sheets');
        })
        .catch(error => {
            console.error('❌ Error sending to Google Sheets:', error);
        });
    }
    
    // Log data locally and remotely
    function logData(data) {
        console.log('=== VISITOR DATA ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('===================');
        
        // Store in localStorage for local dashboard
        try {
            const visits = JSON.parse(localStorage.getItem('visits') || '[]');
            visits.push(data);
            localStorage.setItem('visits', JSON.stringify(visits));
            localStorage.setItem('lastVisit', JSON.stringify(data));
        } catch (e) {
            console.error('Could not store visit data:', e);
        }
        
        // Send to Google Sheets
        sendToGoogleSheets(data);
    }
    
    // Track clicks
    function trackClick(event) {
        lastActivityTime = Date.now();
        const clickData = {
            timestamp: new Date().toISOString(),
            element: event.target.tagName,
            text: event.target.textContent?.substring(0, 50),
            href: event.target.href,
            x: event.clientX,
            y: event.clientY
        };
        console.log('Click tracked:', clickData);
    }
    
    // Track user activity for accurate time on page
    function trackActivity() {
        lastActivityTime = Date.now();
    }
    
    // Send final page duration when leaving
    function sendPageLeaveData() {
        const finalData = collectData();
        
        console.log('🚪 Page leave detected! Time on page:', finalData.timeOnPage, 'seconds');
        
        // Log locally
        try {
            const visits = JSON.parse(localStorage.getItem('visits') || '[]');
            visits.push(finalData);
            localStorage.setItem('visits', JSON.stringify(visits));
            localStorage.setItem('lastVisit', JSON.stringify(finalData));
        } catch (e) {
            console.error('Could not store visit data:', e);
        }
        
        // Send to Google Sheets using sendBeacon (more reliable on page unload)
        if (ENABLE_REMOTE_LOGGING && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            const flatData = {
                timestamp: finalData.timestamp,
                timeOnPage: finalData.timeOnPage,
                sessionDuration: finalData.sessionDuration,
                sessionStartTime: finalData.sessionStartTime,
                url: finalData.url,
                referrer: finalData.referrer,
                title: finalData.title,
                userAgent: finalData.userAgent,
                platform: finalData.platform,
                language: finalData.language,
                cookieEnabled: finalData.cookieEnabled,
                screenWidth: finalData.screenWidth,
                screenHeight: finalData.screenHeight,
                screenColorDepth: finalData.screenColorDepth,
                viewportWidth: finalData.viewportWidth,
                viewportHeight: finalData.viewportHeight,
                deviceMemory: finalData.deviceMemory,
                hardwareConcurrency: finalData.hardwareConcurrency,
                maxTouchPoints: finalData.maxTouchPoints,
                connectionType: finalData.connection.effectiveType,
                connectionDownlink: finalData.connection.downlink,
                connectionRTT: finalData.connection.rtt,
                timezone: finalData.timezone,
                timezoneOffset: finalData.timezoneOffset,
                canvasFingerprint: finalData.canvasFingerprint,
                webglVendor: finalData.webglFingerprint.vendor || 'unknown',
                webglRenderer: finalData.webglFingerprint.renderer || 'unknown',
                fontsDetected: finalData.fonts.join(', '),
                fontsCount: finalData.fonts.length,
                loadTime: finalData.performance.timing.loadTime,
                domReady: finalData.performance.timing.domReady
            };
            
            const blob = new Blob([JSON.stringify(flatData)], { type: 'application/json' });
            const sent = navigator.sendBeacon(GOOGLE_SCRIPT_URL, blob);
            console.log('📤 SendBeacon result:', sent ? 'SUCCESS' : 'FAILED');
        }
        
        console.log('📤 Final page duration sent:', finalData.timeOnPage, 'seconds');
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Don't send initial data - only send when leaving
        // const data = collectData();
        // logData(data);
        
        console.log('📊 Analytics initialized. Will send data on page leave.');
        
        // Track all clicks
        document.addEventListener('click', trackClick);
        
        // Track mouse movement and scrolling as activity
        document.addEventListener('mousemove', trackActivity);
        document.addEventListener('scroll', trackActivity);
        document.addEventListener('keypress', trackActivity);
        
        // Add visual indicator that tracking is active
        const indicator = document.createElement('div');
        indicator.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#4CAF50;color:white;padding:8px 12px;border-radius:4px;font-size:12px;z-index:9999;';
        indicator.textContent = '📊 Analytics Active';
        document.body.appendChild(indicator);
        
        // Update indicator with time on page every second
        setInterval(function() {
            const seconds = Math.round((Date.now() - pageLoadTime) / 1000);
            indicator.textContent = `📊 Analytics Active (${seconds}s)`;
        }, 1000);
    });
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', function() {
        console.log('Visibility changed:', document.hidden ? 'hidden' : 'visible');
        if (document.hidden) {
            sendPageLeaveData();
        }
    });
    
    // Track beforeunload (page leaving)
    window.addEventListener('beforeunload', function() {
        sendPageLeaveData();
        console.log('Page unloading at:', new Date().toISOString());
    });
    
    // Also track pagehide (more reliable on mobile)
    window.addEventListener('pagehide', function() {
        sendPageLeaveData();
    });
    
})();