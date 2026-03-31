# Position Sizer PWA - Enhanced Version

A mobile-first Progressive Web App for calculating forex/CFD position sizes with advanced risk management features.

## 🆕 What's New

### Core PWA Features
- ✅ **Service Worker** - Full offline functionality
- ✅ **Local Icons** - No external dependencies
- ✅ **Smart Caching** - Exchange rates & news cached for offline use
- ✅ **Connection Status** - Live indicator showing data freshness

### Enhanced UX
- ✅ **Session Memory** - Entry/SL/TP saved for 5 minutes when switching apps
- ✅ **Persistent Settings** - Balance & Risk % always remembered
- ✅ **Input Validation** - Haptic feedback on invalid entries
- ✅ **Multiple Copy Buttons** - Copy Lots, Entry, SL, TP individually
- ✅ **Economic Calendar** - Forex Factory high-impact news integration

### Mobile Optimizations
- ✅ **Haptic Feedback** - Vibration on button taps and errors
- ✅ **Contextual News Banner** - Alerts 2 hours before major news
- ✅ **Status Indicators** - 🟢 Live / 🟡 Cached / 🔴 Offline

## 📱 Installation

### GitHub Pages Deployment

1. **Upload files to your repo:**
   ```bash
   git add index.html service-worker.js manifest.json icon-192.png icon-512.png
   git commit -m "Enhanced PWA with offline support"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to: Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

3. **Access your PWA:**
   - URL: `https://yourusername.github.io/repo-name/`
   - Add to home screen on mobile for app-like experience

### Installing on Mobile

**iOS (Safari):**
1. Open the PWA in Safari
2. Tap Share button (box with arrow)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the PWA in Chrome
2. Tap menu (three dots)
3. "Add to Home screen" or "Install app"
4. Confirm

## 🎯 Features

### Position Calculation
- Auto-detects LONG/SHORT based on Entry vs SL
- Supports 15 trading pairs (Forex, Indices, Metals)
- Accounts for leverage, contract size, commission
- Real-time pip/point distance calculation
- Margin usage & free margin tracking

### Risk Management
- Configurable risk percentage
- Flat $9 commission deduction
- Account balance persistence
- Current used margin tracking
- Max position size by available margin

### Economic Calendar
- High-impact news from Forex Factory
- Sydney timezone (your location)
- Contextual banner (shows only if news within 2 hours)
- Full day view in modal
- Cached for offline access (24h)

### Session Management
- **Persistent (localStorage):**
  - Account Balance
  - Risk %
  - Exchange rates (6h cache)
  - Economic calendar (24h cache)

- **Temporary (sessionStorage, 5min timeout):**
  - Selected pair
  - Entry price
  - Stop Loss
  - Take Profit

- **Always Resets:**
  - Current Used Margin (defaults to 0)

### Copy Functionality
Four individual copy buttons for MT4 mobile workflow:
1. **Copy Lots** - Main position size
2. **Copy Entry** - Entry price
3. **Copy SL** - Stop loss price
4. **Copy TP** - Take profit price

Each button:
- Copies value to clipboard
- Shows "Copied!" confirmation
- Haptic feedback on tap

## 🔧 Configuration

### Broker Settings
Current settings match your broker (likely IC Markets):
- **Commission:** $9 flat round-turn
- **Leverage:** 30:1 (Forex), 20:1 (Indices), 10:1 (Metals)
- **Account Currency:** AUD

To change, edit these values in `index.html`:
```javascript
const FLAT_COMMISSION = 9.00; // Line 548

const pairConfig = {
    "GBPUSD": { lev: 30, cs: 100000, pip: 10000 },
    // ... edit leverage (lev) per pair
};
```

### Cache Durations
```javascript
const RATE_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
```

### News Alert Window
Change when news banner appears:
```javascript
// Line 985 in index.html
return minutesUntil > 0 && minutesUntil <= 120; // 2 hours
```

## 📊 Status Indicators

**Connection Status (Top Right):**
- 🟢 **Live rates** - Fetched within last 5 minutes
- 🟡 **Cached 2h ago** - Using cached rates (still valid for 6h)
- 🔴 **Manual entry** - No cache, enter rates manually

**Economic Calendar:**
- ⚠️ **Orange banner** - High-impact news within 2 hours
- **Red text** - News within 30 minutes (urgent)
- **Gray + strikethrough** - Past events (in modal view)

## 🚀 Performance

- **Initial load:** ~150KB total
- **Cached load:** <10KB (instant)
- **Offline capable:** ✅ Yes (core functionality)
- **Exchange rates:** Cached 6 hours
- **News data:** Cached 24 hours

## 🔒 Privacy & Data

**What's stored locally:**
- Account balance, risk % (localStorage)
- Session data: pair, entry, SL, TP (sessionStorage, auto-clears)
- Cached exchange rates (6h expiry)
- Cached news feed (24h expiry)

**What's NOT stored:**
- No trade history
- No account credentials
- No personal information
- No tracking/analytics

**External requests:**
- Exchange rates: `api.exchangerate-api.com`
- Economic calendar: `nfs.faireconomy.media` (Forex Factory)

## 🐛 Troubleshooting

**App won't work offline:**
- First visit requires internet (to cache files)
- After first load, fully functional offline
- Clear browser cache and revisit if issues persist

**Exchange rates not updating:**
- Check connection status indicator
- Manual entry fallback always available
- Cached rates valid for 6 hours

**News not showing:**
- Requires internet on first load
- Check if today has high-impact USD/AUD/EUR/GBP news
- Banner only shows if news within 2 hours

**Session data not restoring:**
- Only restores if app reopened within 5 minutes
- Intentional design (fresh start for new trades)
- Balance/Risk always persist

## 📝 Workflow Example

**Typical mobile trading session:**

1. ✅ Morning: Open app → Check news banner
2. ✅ Trade setup triggers → Open TradingView
3. ✅ Identify entry/SL/TP → Open Position Sizer
4. ✅ Enter details → See position size calculated
5. ✅ Copy lots → Switch to MT4 → Paste
6. ✅ Copy entry → Switch to MT4 → Paste
7. ✅ Copy SL → Switch to MT4 → Paste
8. ✅ Copy TP → Switch to MT4 → Paste
9. ✅ Confirm order → Done

**With news awareness:**
- App shows: "⚠️ USD NFP • 11:30 PM • in 25 min"
- Decision: Wait for news or skip trade

## 🔄 Updates & Maintenance

**To update the app:**
1. Edit files in your repo
2. Commit and push changes
3. Service worker auto-updates on next visit
4. Users may need to close/reopen app once

**Cache clearing (if needed):**
```javascript
// In browser console:
caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
location.reload();
```

## 📄 License

Personal use for your own trading. Feel free to modify and enhance!

## 🙏 Credits

- Economic calendar data: Forex Factory
- Exchange rates: ExchangeRate-API
- Built for mobile-first trading workflow

---

**Version:** 2.0  
**Last Updated:** March 2026  
**Tested on:** iOS Safari, Android Chrome
