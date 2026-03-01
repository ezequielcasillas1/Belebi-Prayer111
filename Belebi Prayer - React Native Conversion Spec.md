================================================================================
BELEBI PRAYER APP — FULL REACT NATIVE CONVERSION SPECIFICATION
================================================================================
Paste this entire document into Cursor AI to build the React Native (Expo) app.

================================================================================
SECTION 1: TECH STACK & PROJECT SETUP
================================================================================

Target: React Native with Expo (SDK 51+), Expo Dev Client, TypeScript
Styling: NativeWind v4 (Tailwind CSS for React Native)
Navigation: React Navigation v6 (Stack + Drawer navigators)
Icons: lucide-react-native
State: React Context + useReducer (same pattern as web)
Storage: AsyncStorage (replaces localStorage)
Images: React Native Image component with URI sources (Unsplash URLs)

INSTALL COMMANDS:
npx create-expo-app belebi-prayer --template expo-template-blank-typescript
cd belebi-prayer
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/drawer
npx expo install react-native-screens react-native-gesture-handler
npm install lucide-react-native react-native-svg
npx expo install @react-native-async-storage/async-storage

PROJECT STRUCTURE:
/src
  /context
    AppContext.tsx
  /data
    mockData.ts
  /navigation
    RootNavigator.tsx
  /screens
    WelcomeScreen.tsx
    SetupScreen.tsx
    VerifyScreen.tsx
    HomeScreen.tsx
    AutoModeScreen.tsx
    PrayForNationScreen.tsx
    PrayerListScreen.tsx
    PrayerProfileScreen.tsx
    PlanPrayerScreen.tsx
    PrayersSentScreen.tsx
    DirectoryScreen.tsx
    CountryDetailScreen.tsx
    LivePrayerRoomScreen.tsx
    CreateRequestScreen.tsx
    SettingsScreen.tsx
    HelpSafetyScreen.tsx
  /components
    AppHeader.tsx
    Badge.tsx
    Buttons.tsx
    PrayerRequestCard.tsx
    DrawerNav.tsx
    SafetyBanner.tsx
    WorldMap.tsx
    CountryActionModal.tsx
    ImageCarousel.tsx
    ReportModal.tsx
    AtoZTabs.tsx
    ToastContainer.tsx
/global.css
/tailwind.config.js
/nativewind-env.d.ts

NATIVEWIND v4 CONFIG:
- tailwind.config.js: content points to ./src/**/*.{js,jsx,ts,tsx}
- babel.config.js: add "nativewind/babel" to plugins
- metro.config.js: wrap with withNativeWind from "nativewind/metro"
- global.css: @tailwind base; @tailwind components; @tailwind utilities;
- nativewind-env.d.ts: /// <reference types="nativewind/types" />
- Import global.css in App.tsx entry point

KEY DIFFERENCES FROM WEB:
- Use View instead of div
- Use Text instead of span/p/h1-h6 (all text MUST be inside Text)
- Use TouchableOpacity or Pressable instead of button
- Use TextInput instead of input/textarea
- Use ScrollView instead of overflow:auto containers
- Use Image with source={{uri: "..."}} instead of img
- Use Modal from react-native instead of fixed-position dialog divs
- Use Animated or react-native-reanimated for animations
- No CSS hover states - use Pressable with onPressIn/onPressOut
- No fixed positioning - use absolute within a relative container
- StyleSheet.create for static styles, className for NativeWind
- SafeAreaView for top-level screen wrappers
- Platform.OS for platform-specific code
- Dimensions or useWindowDimensions for screen measurements
- FlatList instead of mapped lists for performance
- KeyboardAvoidingView for screens with text inputs
- StatusBar component to control status bar appearance

================================================================================
SECTION 2: COLOR PALETTE & DESIGN TOKENS
================================================================================

PRIMARY COLORS:
- Brand Primary: #6B4F3E (warm brown - buttons, active states, accents)
- Brand Primary Dark: #5A3E2F (hover/pressed state)
- Brand Primary Disabled: #C4A89A (disabled buttons)
- Background Gradient: radial-gradient(circle, #fdfcfb 0%, #e2d1c3 100%)
  In RN: use a LinearGradient approximation or solid #FDF9F4

TEXT COLORS:
- Text Primary: #1C0F0A (headings, main text)
- Text Secondary: #5C3D2E (body text, descriptions)
- Text Muted: #7A5C4A (secondary info)
- Text Subtle: #9B7B6A (hints, timestamps, labels)
- Text Disabled: #C4A89A

SURFACE COLORS:
- Card Background: rgba(253,249,244,0.92) → #FDF9F4 solid
- Header Background: rgba(253,252,251,0.85) → #FDFCFB solid
- Input Background: rgba(253,249,244,0.9) → #FDF9F4
- Drawer Background: gradient from #fdfcfb to #e8d8c8

BORDER COLORS:
- Default Border: rgba(139,111,94,0.18) → #E8D8C8
- Input Border: rgba(139,111,94,0.3) → #D4C4B0
- Subtle Border: rgba(139,111,94,0.15) → #EDE0D4
- Active Border: #6B4F3E

STATUS COLORS:
- Success BG: #E8F5EE, Border: #A8D5BE, Text: #1A4731
- Warning BG: #FFF8E7, Border: #F5D98A, Text: #7A5000
- Error BG: #FFF0F0, Border: #F5AAAA, Text: #7A1E1E
- Info BG: rgba(107,79,62,0.08), Border: rgba(107,79,62,0.2), Text: #4A3528

BADGE VARIANTS:
- denomination: bg rgba(107,79,62,0.1), text #5C3D2E, border rgba(107,79,62,0.2)
- success: bg #E8F5EE, text #1A4731, border #A8D5BE
- warning: bg #FFF8E7, text #7A5000, border #F5D98A
- error: bg #FFF0F0, text #7A1E1E, border #F5AAAA
- info: bg rgba(107,79,62,0.08), text #4A3528, border rgba(107,79,62,0.2)

SIZING:
- Border Radius Cards: 16px
- Border Radius Buttons: 12px
- Border Radius Badges: 20px (pill)
- Border Radius Inputs: 12px
- Icon Sizes: small=13-16, medium=18-22, large=28-32
- Button Heights: sm=36px, md=44px, lg=52px

================================================================================
SECTION 3: NAVIGATION STRUCTURE (React Navigation)
================================================================================

Use a combination of Stack Navigator (main flow) and Drawer Navigator (sidebar).

AUTH STACK (no drawer):
- WelcomeScreen (initial route when not authenticated)
- VerifyScreen
- SetupScreen

MAIN DRAWER (after auth):
Drawer items:
1. Home (World Map) → HomeScreen
2. Prayer List → PrayerListScreen
3. Plan Prayer → PlanPrayerScreen
4. Prayers Sent → PrayersSentScreen
5. Ask for Prayer → CreateRequestScreen
6. Settings → SettingsScreen
7. Help & Safety → HelpSafetyScreen

STACK SCREENS (inside drawer, accessed via navigation):
- CountryDetailScreen (route param: code)
- PrayForNationScreen (route param: code)
- DirectoryScreen (optional param: code for country-filtered)
- PrayerProfileScreen (route param: id)
- AutoModeScreen
- LivePrayerRoomScreen (route param: code)

The RootNavigator should check state.isAuthenticated:
- If false: show Auth Stack
- If true: show Main Drawer + Stack

Custom Drawer Content:
- Shows app logo (🙏 Belebi Prayer)
- Shows current user info (flag + firstName, "Guest" badge if guest)
- Shows current mode badge (Auto Mode / Manual Mode with green/gray dot)
- Nav items with icons matching the web version
- Footer: Sign Out button (or "Sign In / Register" for guests)

================================================================================
SECTION 4: STATE MANAGEMENT (AppContext.tsx)
================================================================================

The context is a React Context + useReducer. Convert from web to RN:
- Replace localStorage with AsyncStorage (async read/write)
- Keep the exact same state shape, action types, and reducer logic
- Use useEffect to load state from AsyncStorage on mount
- Use useEffect to persist state to AsyncStorage on changes

STATE SHAPE:
interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;            // {id, firstName, country, countryCode, flag, denomination, email}
  selectionMode: 'manual' | 'auto';
  autoAssignment: AutoAssignment | null; // {requestId, assignedAt, expiresAt} - 12 hour window
  plannedPrayer: PlannedPrayer | null;   // {requestId, addedAt, expiresAt} - 24 hour window
  sentPrayers: SentPrayer[];             // array of submitted prayers with snapshots
  toasts: Toast[];                       // {id, type, message}
  viewerCounts: Record<string, number>;  // simulated viewer counts per request
}

ACTIONS:
LOGIN, LOGOUT, SET_SELECTION_MODE, SET_AUTO_ASSIGNMENT, SET_PLANNED_PRAYER,
ADD_SENT_PRAYER, ADD_TOAST, REMOVE_TOAST, UPDATE_VIEWER_COUNT

CONTEXT HELPERS (provided via context value):
- login(user) - dispatches LOGIN
- logout() - dispatches LOGOUT, resets to clean state
- setSelectionMode(mode) - 'manual' or 'auto'
- assignAuto() - picks random request with prayersSentCount <= 2, creates 12h assignment
- checkAutoExpiry() - clears expired auto assignment, returns true if expired
- getAutoRequest() - returns current auto-assigned PrayerRequest or null
- setPlanPrayer(requestId) - single slot, 24h expiry
- clearPlanPrayer() - removes planned prayer
- checkPlanExpiry() - clears expired plan, returns true if expired
- getPlannedRequest() - returns planned PrayerRequest or null
- submitPrayer(requestId, prayerText) - creates SentPrayer, clears plan/auto if matching
- hasSentPrayer(requestId) - checks if user already prayed for this request
- showToast(type, message) - adds toast, auto-removes after 3500ms
- getViewerCount(requestId) - returns simulated viewer count
- getAvailableRequests() - returns requests not yet prayed for

VIEWER COUNT SIMULATION:
- On mount, generate random counts (1-18) for all requests
- Every 4 seconds, pick a random request and adjust count by +1 or -1 (clamped 1-30)

PERSISTENCE:
- Save to AsyncStorage key 'belebi_app_state'
- Exclude toasts and viewerCounts from persistence
- Load on app start, merge with defaults

================================================================================
SECTION 5: MOCK DATA (mockData.ts)
================================================================================

Keep this file identical to the web version. It contains:

INTERFACES:
- Country: {code, name, flag, activeRequests, lat, lon, region}
- PrayerRequest: {id, name, letter, country, countryCode, flag, denomination, requestText, description, profileImages[], emergencyImages[], prayersSentCount, createdAt, expiresAt, autoDismissTime, requesterId}
- ChatMessage: {id, countryCode, senderId, senderName, senderCountry, senderFlag, text, timestamp, removed?}

DATA:
- COUNTRIES: 25 countries with codes, flags, regions, coordinates, activeRequests counts
- PRAYER_REQUESTS: 30 requests (A-Z names + extras), each with realistic prayer text, profile images (Unsplash URLs), emergency images, denomination, country
- CHAT_MESSAGES: Pre-seeded messages for NG, UA, KE country rooms
- NATION_PRAYER_POINTS: Country-specific prayer focus points for NG, UA, KE + default fallback

IMAGE CONSTANTS (Unsplash URLs used for profile/emergency images):
- IMG_AFRICAN_WOMAN: https://images.unsplash.com/photo-1710117045399-0fab00350f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400
- IMG_ASIAN_MAN: https://images.unsplash.com/photo-1714746643386-b0b145e9cdd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400
- IMG_LATIN_WOMAN: https://images.unsplash.com/photo-1635697299066-5986469dd072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400
- IMG_MIDEAST_MAN: https://images.unsplash.com/photo-1766334079470-7f36e9c78311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400
- IMG_ASIAN_WOMAN: https://images.unsplash.com/photo-1764216069652-fbff0e0337f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400
- IMG_EURO_MAN: https://images.unsplash.com/photo-1763913086998-ef72958e93ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400
- IMG_LANDSCAPE: https://images.unsplash.com/photo-1764714648804-bc8efdaafb1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400

================================================================================
SECTION 6: REUSABLE COMPONENTS
================================================================================

--- COMPONENT: AppHeader ---
Props: title, subtitle?, showBack?, showMenu?, showSettings?, showAdd?, onMenuPress?, onAddPress?, rightElement?
Layout: Row with left/center/right sections
- Left: Back arrow button (ArrowLeft icon, 36x36 circle) OR Menu hamburger button (Menu icon)
- Center: Title (bold, #1C0F0A) + optional subtitle below (#5C3D2E, smaller)
- Right: Optional rightElement + Settings gear button + Add plus button
Background: #FDFCFB with bottom border #EDE0D4
Icons from lucide-react-native: ArrowLeft, Menu, Plus, Settings
In RN: Use SafeAreaView or account for status bar. Use navigation.goBack() for back button.

--- COMPONENT: Badge ---
Props: children, variant? ('denomination'|'status'|'country'|'success'|'warning'|'error'|'info'), size? ('sm'|'md')
Renders a pill-shaped badge with variant-specific colors (see color palette above)
Size sm: paddingVertical 4, paddingHorizontal 10, fontSize 11
Size md: paddingVertical 6, paddingHorizontal 13, fontSize 13

--- COMPONENT: Buttons (PrimaryButton, SecondaryButton, GhostButton, DestructiveButton, IconButton) ---
All accept: children, fullWidth?, size? ('sm'|'md'|'lg'), disabled?, onPress (not onClick)
PrimaryButton: bg #6B4F3E, text white, shadow, disabled=#C4A89A
SecondaryButton: transparent bg, #6B4F3E border (2px), #6B4F3E text
GhostButton: transparent bg, no border, #6B4F3E text
DestructiveButton: transparent bg, #7A1E1E border (2px), #7A1E1E text
IconButton: 40x40 circle, bg rgba(107,79,62,0.1), color #6B4F3E
All use borderRadius 12, flexDirection row, alignItems center, justifyContent center, gap 8
Size heights: sm=36, md=44, lg=52

--- COMPONENT: PrayerRequestCard ---
Props: request (PrayerRequest), showSnippet? (default true), compact? (default false)
Layout: Horizontal card with profile image circle on left, content on right
- Profile image: 52px circle (44px if compact), border, shows first profileImage or initial letter
- Content: Name (bold), flag+country with MapPin icon, denomination Badge, optional Emergency Badge
- Snippet: 2-line truncated requestText (if showSnippet and not compact)
- ChevronRight icon on right edge
Card style: bg #FDF9F4, border #E8D8C8, borderRadius 16, shadow, marginBottom 10
On press: navigate to PrayerProfileScreen with request.id
Icons: ChevronRight, MapPin from lucide-react-native

--- COMPONENT: DrawerNav (Custom Drawer Content) ---
Used as drawerContent in Drawer.Navigator
Shows:
- Header: 🙏 emoji + "Belebi" title + "Prayer" subtitle + user info (flag + name + Guest badge)
- Mode badge: green dot + "Auto Mode" or gray dot + "Manual Mode"
- Nav items list: Home, Prayer List, Plan Prayer, Prayers Sent, Ask for Prayer, Settings, Help & Safety
  Each with icon (Home, Users, BookmarkPlus, Send, PlusCircle, Settings, HelpCircle)
  Active item: bg highlighted, right border accent #6B4F3E
- Footer: Sign Out button (or "Sign In / Register" for guests)
Background: gradient from #fdfcfb to #e8d8c8
Width: 280

--- COMPONENT: SafetyBanner ---
Expandable yellow warning banner for Live Prayer Room
Default: collapsed, shows Shield icon + "Safety Reminder - Tap to read"
Expanded: Shows safety rules (don't share phone/email/address, report button, contact authorities)
Colors: bg #FFF8E7, border #F5D98A, text #7A5000

--- COMPONENT: WorldMap ---
Props: countries (Country[]), onCountrySelect (callback)
SVG-based world map using react-native-svg
- Uses equirectangular projection (viewBox 0 0 900 450)
- Continent shapes as Path elements (fill #D4C4B0, stroke #B8A090)
- Country markers as Circle elements at lat/lon positions
  - Normal: radius 8, fill #8B6F5E, white stroke
  - Active/pressed: radius 10, fill #6B4F3E
  - Shows request count as text inside circle
- Legend below map: dot + "Tap a country to pray"
On country press: calls onCountrySelect with the Country object
Note: In React Native, use Svg, Circle, Path, Text, G, Rect from react-native-svg

COUNTRY POSITIONS (lat,lon → x,y via equirectangular):
  x = ((lon + 180) / 360) * 900
  y = ((90 - lat) / 180) * 450
Positions for all 25 countries are pre-calculated in the web version.

CONTINENT PATHS (simplified SVG path data for the equirectangular projection):
North America: M 95,55 C 120,48 195,52 262,65 L 275,85 L 272,120 L 255,152 L 232,185 L 208,215 L 183,228 L 162,222 L 148,200 L 130,172 L 104,148 L 82,118 L 72,85 Z
Greenland: M 192,18 L 240,12 L 272,20 L 268,42 L 245,52 L 208,52 L 190,38 Z
South America: M 192,235 L 242,225 L 272,245 L 285,275 L 288,315 L 275,358 L 254,385 L 222,400 L 190,398 L 168,378 L 156,348 L 155,308 L 165,270 L 178,252 Z
Europe: M 432,48 L 505,42 L 538,58 L 548,82 L 538,105 L 558,118 L 548,138 L 510,150 L 475,158 L 448,150 L 432,128 L 428,92 Z
Africa: M 440,162 L 495,155 L 538,162 L 568,188 L 580,228 L 578,272 L 562,318 L 538,348 L 508,362 L 476,368 L 448,352 L 428,322 L 418,282 L 418,240 L 430,202 Z
Asia: M 548,42 L 658,38 L 755,40 L 848,52 L 918,68 L 942,98 L 932,132 L 902,152 L 862,142 L 822,168 L 788,182 L 745,178 L 705,198 L 658,208 L 608,198 L 572,182 L 548,158 L 542,118 L 548,72 Z
SE Asia Peninsula: M 718,198 L 752,192 L 768,225 L 758,258 L 740,262 L 722,242 L 716,218 Z
Oceania: M 748,282 L 818,268 L 882,272 L 922,298 L 918,332 L 878,358 L 822,368 L 768,352 L 745,322 L 742,298 Z

--- COMPONENT: CountryActionModal ---
Props: country (Country|null), onClose
Bottom sheet modal (use React Native Modal with slide animation)
Shows when country is not null
Content:
- Drag handle bar at top (36x4 rounded bar)
- Header: flag + country name + active requests count + X close button
- Three action buttons in a column:
  1. Globe icon + "Pray for the Nation" + "Intercede for the country" → navigate to PrayForNationScreen
  2. Users icon + "Pray for the People" + "{count} active prayer requests" → navigate to DirectoryScreen (filtered)
  3. MessageCircle icon + "Live Prayer Room" + "Join the live country chat" → navigate to LivePrayerRoomScreen
Each action: rounded card with icon box (44x44, rounded 12) on left, text on right
Background: gradient #fdfcfb to #ede0d4, borderRadius top 24

--- COMPONENT: ImageCarousel ---
Props: images (string[]), label?, height? (default 220)
Empty state: gray box with Image icon + "No images" text
Single/multi image carousel:
- Shows current image full width at given height, objectFit cover
- If multiple: prev/next arrow buttons (ChevronLeft/ChevronRight, 36x36 circles with dark overlay)
- Dot indicators at bottom (active dot wider 18px, inactive 7px, white colors)
- Optional label badge in top-left corner (dark overlay pill)
In RN: Use FlatList horizontal with paging, or ScrollView with pagingEnabled

--- COMPONENT: ReportModal ---
Props: isOpen, onClose, targetType ('profile'|'message'), targetName?
Bottom sheet modal with:
- Drag handle
- Header: Flag icon + "Report Prayer Request" or "Report Message" + X close button
- Target name display
- Safety note (yellow warning box with AlertTriangle icon)
- List of 7 report reasons as tappable buttons:
  Inappropriate content, Sharing personal contact information, Spam or self-promotion,
  Harassment or bullying, Misinformation, Suspicious activity, Other
On tap reason: shows toast "Report submitted" and closes modal

--- COMPONENT: AtoZTabs ---
Props: selected (string), onChange (callback), availableLetters? (Set<string>)
Horizontal scrollable row of 26 letter buttons (A-Z)
- Selected: bg #6B4F3E, text white, bold
- Available: bg rgba(107,79,62,0.06), text #5C3D2E
- Unavailable: transparent bg, text #C4A89A, disabled
Each button: 32x32, borderRadius 8
Auto-scrolls to selected letter
In RN: Use ScrollView horizontal with ref scrollTo

--- COMPONENT: ToastContainer ---
Reads toasts from AppContext
Renders toast notifications near bottom of screen
Each toast: row with icon + message + dismiss X button
- success: green colors + CheckCircle icon
- error: red colors + XCircle icon
- info: neutral colors + Info icon
Style: rounded 12, shadow, slide-up animation
Position: absolute bottom ~88px, centered

================================================================================
SECTION 7: ALL 16 SCREENS — DETAILED SPECIFICATIONS
================================================================================

--- SCREEN 1: WelcomeScreen ---
Route: Initial screen (no auth required)
Layout: Full screen, centered content, warm gradient background
Content from top to bottom:
1. App icon: 72x72 rounded square (borderRadius 22), bg rgba(107,79,62,0.12), 🙏 emoji inside
2. Hero section:
   - "Belebi" title (fontSize ~38, fontWeight 800, color #1C0F0A)
   - "Prayer" subtitle (fontSize ~17, color #6B4F3E, letterSpacing 0.05em)
   - Decorative divider line (40px wide, 3px tall, color rgba(107,79,62,0.3))
   - Description text: "A global prayer community connecting hearts across nations..."
   - Stats row: "25+ Countries | 200+ Prayers | Global Community" in a rounded card
3. Action section:
   - "Create Account" PrimaryButton → navigates to SetupScreen
   - "Sign In" SecondaryButton → navigates to VerifyScreen
   - "or" divider
   - "Skip — explore as guest" underlined text link → logs in as guest user and navigates to HomeScreen
   - Terms/Privacy text at bottom

Guest login creates user: {id:'guest', firstName:'Guest', country:'Worldwide', countryCode:'WW', flag:'🌍', denomination:'', email:''}

--- SCREEN 2: SetupScreen ---
Route: Auth flow (no auth required)
Layout: Back button header + form + submit button
Content:
1. Header: Back arrow button + "Set Up Your Profile" title + "Tell us a little about yourself" subtitle
2. Privacy note: rounded card with 🔒 "Only your first name and country are visible..."
3. Form fields:
   - First Name (TextInput, required, placeholder "Your first name")
   - Country (Picker/dropdown, required, lists all 25 COUNTRIES sorted alphabetically with flags)
   - Denomination (Picker/dropdown, optional, lists 14 denominations: Prefer not to say, Anglican, Baptist, Catholic, Charismatic, Lutheran, Methodist, Non-denominational, Orthodox, Pentecostal, Presbyterian, Protestant, Reformed, Other)
4. Submit button: "Finish — Join the Community" PrimaryButton (disabled until name+country filled)
   On submit: simulated 600ms delay, then login() and navigate to HomeScreen

--- SCREEN 3: VerifyScreen ---
Route: Auth flow
4-step verification flow: email → otp-email → phone → otp-phone
Layout: Back button header + progress bar + shield icon + step content + continue button
Step 1 (email): Email TextInput with Mail icon
Step 2 (otp-email): 6-digit OTP input (6 separate single-digit inputs, auto-focus next on entry, backspace goes to previous) + "Resend code" button
Step 3 (phone): Phone TextInput with Phone icon
Step 4 (otp-phone): Same 6-digit OTP + "Resend code"
Progress bar: 4px tall, fills 25%/50%/75%/100% based on step
Back button: goes to previous step (or back to WelcomeScreen from step 1)
Continue button: simulated 800ms delay, advances to next step. After step 4 → navigates to SetupScreen
Each step shows: step counter "Step X of 4" + step label + ShieldCheck icon + privacy message

--- SCREEN 4: HomeScreen ---
Route: /home (main screen after auth)
Uses AppHeader with: title "Belebi – Prayer", showMenu, showSettings, Auto badge if auto mode
Uses Drawer (openDrawer from navigation)
Content (scrollable):
1. Greeting: "Welcome, {firstName} 🌍" + "Tap a country on the map to begin praying"
2. WorldMap component: Interactive SVG map with country markers
3. Auto Mode CTA (if selectionMode === 'auto'): Rounded card with Zap icon + "Auto Mode Active" + "Pray Now" button → navigates to AutoModeScreen
4. Countries section:
   - Header: "Countries" + "{count} nations"
   - Search bar with Search icon (filters countries by name)
   - Country list: sorted by activeRequests desc, each item shows flag+name+region on left, Badge with request count on right
   - On tap country: opens CountryActionModal
5. CountryActionModal component at bottom

--- SCREEN 5: AutoModeScreen ---
Route: /auto-mode
Uses AppHeader with: title "Auto Prayer Mode", showBack
Content:
1. Info card: Zap icon (44x44 brown box) + "Pray Where Needed Most" title + Auto badge + description about skipping 3+ prayers
2. Timer pill: Clock icon + "Auto assignment: {hours}h {minutes}m remaining" (updates every 30s)
3. States:
   a. Loading: spinning 🙏 emoji + "Finding someone who needs prayer..."
   b. No requests: 🌟 + "All Covered for Now!" + "Browse All Requests" button
   c. Assigned request: "Your Assignment" header + Reassign button (RefreshCw icon) + PrayerRequestCard + "Open & Pray" PrimaryButton
Business logic:
- On mount: check auto expiry, if expired or no assignment → auto-assign
- assignAuto filters requests with prayersSentCount <= 2
- Assignment persists for 12 hours
- Reassign button triggers new random assignment with 600ms simulated delay

--- SCREEN 6: PrayForNationScreen ---
Route: /country/:code/nation
Param: code (country code)
Uses AppHeader: title "Pray for {countryName}", showBack
Content:
1. Flag (large, 56px font) + Country name + "Interceding for this nation"
2. Prayer Focus section: bulleted list of 5-6 prayer points from NATION_PRAYER_POINTS[code] (falls back to default)
3. Scripture section: BookOpen icon + italicized scripture quote + reference
   Scriptures (random pick from 3):
   - 1 Timothy 2:1-2
   - Psalm 33:12
   - Jeremiah 29:7
4. CTA button: "I Prayed for {country}" PrimaryButton
   After tapped: replaced with green success banner (CheckCircle + "Prayer recorded. Thank you!")
   Shows toast on submit

--- SCREEN 7: PrayerListScreen ---
Route: /prayer-list
Uses AppHeader: title "Prayer List", subtitle "People in need", showMenu
Content:
1. Top action:
   - If auto mode: gradient brown card with Zap icon + "Pray Where Needed Most (Auto)" → navigates to AutoModeScreen
   - If manual mode: outlined card "Browse A-Z Directory →" → navigates to DirectoryScreen
2. Search bar with Filter toggle button
3. Filters panel (expandable): Country dropdown + Denomination dropdown + "Clear filters" button
4. Results count: "{N} requests (filtered/total)"
5. Request list: FlatList of PrayerRequestCard components
   - Filtered by: not already prayed for, search query, country filter, denomination filter
   - Sorted by newest first
6. Empty states: "You've prayed for all available requests" or "No requests match your search"

--- SCREEN 8: PrayerProfileScreen ---
Route: /prayer/:id
Param: id (prayer request ID)
Uses AppHeader: title "Prayer Request", showBack, rightElement = Flag report button
Content (scrollable):
1. Profile images: ImageCarousel (height 210) showing request.profileImages
2. Info section:
   - Name (bold, large) + flag+country
   - Denomination Badge + Emergency Badge (if emergencyImages > 0)
   - Viewer count pill: Eye icon + "{N} people currently in consideration" (updates every 3s)
3. About section: request.description
4. Prayer Request section: quoted requestText in a card
5. Emergency Images section (if any): ImageCarousel (height 160) with ⚠️ heading
6. Auto-dismiss info: "Auto-dismisses in: 1 month / 6 months / 1 year"
7. Actions (if not already submitted):
   - Two buttons side by side: "Plan Prayer" SecondaryButton (BookmarkPlus icon) + "Write Prayer" PrimaryButton (Pencil icon)
   - Below: "Generate AI Prayer Draft Now" GhostButton (Sparkles icon)
   - If composing: textarea with "Write Your Prayer" header, X close, AI Draft button, Submit Prayer button
   - If already sent: green success card "Prayer Submitted - You can view this in Prayers Sent"
8. Replace Plan Modal: dialog asking to replace existing planned prayer
9. ReportModal component

AI Prayer Drafts (3 pre-written prayers, randomly selected with 1200ms simulated delay):
- Draft 1: "Heavenly Father, I come before you on behalf of this dear soul..."
- Draft 2: "Lord God, thank you for hearing the cry of your children..."
- Draft 3: "Gracious God, I lift this precious soul to you today..."

Business logic:
- Plan Prayer: if slot empty → save and navigate to PlanPrayerScreen. If slot occupied → show replace modal
- Submit Prayer: only on explicit "Submit Prayer" tap (not on AI generate). Creates SentPrayer, clears plan/auto if matching
- Viewer count: getViewerCount updates every 3 seconds

--- SCREEN 9: PlanPrayerScreen ---
Route: /plan-prayer
Uses AppHeader: title "Plan Prayer", subtitle "Single prayer slot", showBack
States:
1. Empty state: BookmarkPlus icon (72x72) + "No Planned Prayer Right Now" + description about 24h window + "Find Someone to Pray For" button
2. Expired state: red warning card with Clock icon + "Plan Prayer Expired" + "Clear & Start Fresh" button
3. Submitted state: green success card with 🙏 + "Prayer Submitted!" + "View Prayers Sent" button
4. Active state:
   - Header: "Planned Prayer" + countdown timer pill "Expires in {time}"
   - Profile summary card: ImageCarousel + name + denomination badge + flag+country + truncated request text
   - "Remove from Plan Prayer" text button (X icon)
   - Prayer compose: same as PrayerProfileScreen (Write Prayer button, AI Draft button, textarea, Submit)
Business logic: 24-hour expiry, single slot, countdown updates every 30s

--- SCREEN 10: PrayersSentScreen ---
Route: /prayers-sent
Uses AppHeader: title "Prayers Sent", subtitle "{count} submitted", showBack
States:
1. Empty: Send icon (72x72) + "No Prayers Sent Yet" + description + "Find Someone to Pray For" button
2. List: privacy note + FlatList of expandable prayer cards
Each card:
- Collapsed: name + flag+country + date (Calendar icon) + "🙏 Sent" badge + ChevronRight (rotates when expanded)
- Expanded: "Their Request" section (italicized quote) + "Your Prayer" section (your text)
Sorted newest first

--- SCREEN 11: DirectoryScreen ---
Route: /directory or /country/:code/people
Props: countryFiltered? boolean
Uses AppHeader: title "Prayer Directory" or "People in {country}" + subtitle
Uses AtoZTabs component
Content:
- Letter heading: colored square with letter + "{N} requests" + "Sorted by newest first"
- List of PrayerRequestCard filtered by selected letter
- Auto-selects first available letter if current has no results
- Empty states for no requests at all or no requests for selected letter

--- SCREEN 12: CountryDetailScreen ---
Route: /country/:code
Param: code
Uses AppHeader: title "{countryName}", showBack
Content:
1. Hero: large flag (64px) + country name + region
2. Stats card: Users icon box + "Active Prayer Requests" + count
3. "How would you like to pray?" section with 3 action cards:
   - Globe + "Pray for the Nation" → /country/:code/nation
   - Users + "Pray for the People" + request count → /country/:code/people
   - MessageCircle + "Live Prayer Room" → /country/:code/room

--- SCREEN 13: LivePrayerRoomScreen ---
Route: /country/:code/room
Param: code
Uses AppHeader: title "{flag} {country} Room", subtitle "Live Prayer Room", showBack
Content:
1. SafetyBanner component
2. Online count: green pulsing dot + "{N} people praying together" (random 5-20)
3. Messages area (ScrollView/FlatList):
   - My messages: right-aligned, brown background (#6B4F3E), white text, rounded corners (16 16 4 16)
   - Others' messages: left-aligned, cream background, dark text, rounded corners (16 16 16 4)
     - Flag avatar circle (30px) on left
     - Sender name + country above bubble
     - Report Flag button in each received message
   - Removed messages: dashed border, "[Message removed for safety]"
   - Empty state: "Be the first to pray in this room. 🙏"
4. Input bar: TextInput (rounded pill, placeholder "Share a prayer or encouragement...") + Send circle button (42x42, brown when active)

Business logic:
- Safety filter: blocks messages containing phone numbers or emails (regex pattern)
- Simulated incoming messages: every 12 seconds, adds one of 3 pre-defined messages from Emmanuel/Sarah/David
- Max 300 characters
- Enter key sends (on web; on RN use send button)
- ReportModal for flagging messages
- Auto-scroll to bottom on new messages

--- SCREEN 14: CreateRequestScreen ---
Route: /create-request
Uses AppHeader: title "Ask for Prayer", subtitle "Submit a prayer request", showBack
Content:
1. Privacy note: "Only your first name and country will be visible"
2. Form:
   - Your Name (readonly, from currentUser.firstName)
   - Denomination (Picker, optional, 15 options)
   - Prayer Request (TextArea, required, 800 char max, with character counter)
     - AI Draft button in header (Sparkles icon, 1000ms delay)
   - Profile Images (up to 3): thumbnail grid + dashed "Add" button
     - In prototype: adds mock Unsplash images
   - Emergency Images (up to 3): same grid with red-tinted dashed button
     - AlertTriangle icon label, description about urgent situations
   - Auto-Dismiss After: radio group with 3 options (1 Month, 6 Months, 1 Year)
   - Submit button: "Submit Prayer Request" PrimaryButton
   - Cancel button: SecondaryButton

Submitted state: 🙏 + "Request Submitted!" + description + "Back to Home" + "Dismiss Supplication" DestructiveButton

AI Prayer Drafts for requests (3 different drafts):
- "Father, I come before you with an open heart..."
- "Lord God, you are the same yesterday, today, and forever..."
- "Gracious God, I reach out to my brothers and sisters..."

--- SCREEN 15: SettingsScreen ---
Route: /settings
Uses AppHeader: title "Settings", showMenu
Content:
1. PRAYER SELECTION MODE section:
   Radio group with two options in a card:
   - Manual Mode: Hand icon (44x44 box) + description + radio circle indicator
   - Auto Mode: Zap icon (44x44 box) + description about skipping 3+ prayers + radio circle
   Active option: highlighted bg, filled radio dot
   Info note (if auto): yellow box explaining 12-hour persistence
   On change: shows toast "Switched to Auto/Manual Mode"

2. PRIVACY section:
   Card with Shield icon + "Country-Only Visibility" + description

3. CHAT SAFETY section:
   Card with MessageCircle icon + "Live Room Safety" + bulleted rules

4. ACCOUNT section:
   Card with:
   - User info row (if logged in): User icon circle + name + flag+country+denomination
   - "Help & Safety" navigation button with ChevronRight

5. App version: "Belebi Prayer · Version 1.0.0 Prototype"

Section headers: uppercase, letter-spaced, small font, color #5C3D2E

--- SCREEN 16: HelpSafetyScreen ---
Route: /help-safety
Uses AppHeader: title "Help & Safety", showMenu
Content:
1. Safety First warning card: yellow bg, Shield icon, message about not being a crisis service

2. SAFETY GUIDELINES section: 4 items in a card:
   - Lock: "Protect Your Information"
   - Flag: "Report Concerns"
   - Heart: "Pray with Respect"
   - Phone: "Emergency Services"
   Each with icon, title, body text

3. PRIVACY POLICY SUMMARY section:
   - Country-only visibility
   - Prayer privacy (your identity not shared with requesters)
   - Data control (dismiss supplication)

4. FAQ section: 8 expandable accordion items:
   Q: "Is my location shared with others?" A: No, country only...
   Q: "How do I report inappropriate content?" A: Tap Flag icon...
   Q: "What should I never share in prayer rooms?" A: Never share phone, email...
   Q: "How does Auto Mode work?" A: Assigns for 12 hours, skips 3+...
   Q: "What is Plan Prayer?" A: Single slot, 24 hours to submit...
   Q: "Can the person I'm praying for see my identity?" A: No, only that a prayer was submitted...
   Q: "What happens when a prayer request expires?" A: AI Prayer Draft generated...
   Q: "How do I dismiss my own prayer request?" A: Dismiss Supplication button...
   Each: tappable question row with ChevronDown/ChevronUp toggle

================================================================================
SECTION 8: CRITICAL BUSINESS LOGIC RULES
================================================================================

1. AUTO MODE:
   - Skips requests with prayersSentCount >= 3
   - Assignment persists for 12 HOURS (not session-based)
   - Same person shows until: window expires, prayer submitted, or user reassigns
   - On expiry: auto-assignment cleared, next visit gets new assignment

2. PLAN PRAYER:
   - SINGLE SLOT only (one planned prayer at a time)
   - 24-HOUR EXPIRY from when saved
   - If user tries to plan when slot occupied: show replace confirmation modal
   - Submitting prayer clears the plan slot
   - Expiring shows expired state, user must clear manually

3. PRAYER COUNT:
   - Prayer count increments ONLY on explicit "Submit Prayer" button press
   - NOT on AI draft generation, NOT on "I Prayed for Nation", NOT on viewing
   - prayersSentCount on mock data is static (for auto mode filtering only)
   - sentPrayers array tracks user's actual submissions

4. VIEWER COUNTS:
   - Simulated, not real
   - Random 1-18 on init, fluctuates +-1 every 4 seconds
   - Shown on PrayerProfileScreen as "X people currently in consideration"

5. CHAT SAFETY:
   - Regex blocks phone numbers and emails from being sent
   - Report button on every received message
   - "[Message removed for safety]" for reported/removed messages

6. PERSISTENCE:
   - Auth state, selection mode, auto assignment, planned prayer, sent prayers → persisted
   - Toasts, viewer counts → NOT persisted (regenerated on app start)

================================================================================
SECTION 9: ICONS USED (all from lucide-react-native)
================================================================================

ArrowLeft, Menu, Plus, Settings, Search, Filter, Zap, Hand, RefreshCw, Clock,
Eye, BookmarkPlus, Pencil, Send, Flag, CheckCircle, X, Sparkles, ChevronRight,
ChevronLeft, ChevronDown, ChevronUp, MapPin, Globe, Users, MessageCircle,
Home, HelpCircle, LogOut, PlusCircle, Shield, Mail, Phone, ShieldCheck,
Upload, AlertTriangle, Info, Calendar, Image, Lock, Heart, XCircle, BookOpen, Star

================================================================================
SECTION 10: IMPLEMENTATION ORDER (RECOMMENDED)
================================================================================

Phase 1 - Foundation:
1. Project setup + NativeWind config
2. mockData.ts (copy exactly from web)
3. AppContext.tsx (convert localStorage → AsyncStorage)
4. Buttons.tsx component
5. Badge.tsx component
6. AppHeader.tsx component

Phase 2 - Auth Flow:
7. WelcomeScreen
8. VerifyScreen
9. SetupScreen
10. RootNavigator with auth check

Phase 3 - Core Screens:
11. HomeScreen + WorldMap + CountryActionModal
12. CountryDetailScreen
13. PrayerListScreen + PrayerRequestCard
14. DirectoryScreen + AtoZTabs
15. PrayerProfileScreen + ImageCarousel + ReportModal

Phase 4 - Prayer Features:
16. AutoModeScreen
17. PlanPrayerScreen
18. PrayersSentScreen
19. CreateRequestScreen

Phase 5 - Support Screens:
20. LivePrayerRoomScreen + SafetyBanner
21. SettingsScreen
22. HelpSafetyScreen
23. DrawerNav (custom drawer content)
24. ToastContainer

Phase 6 - Polish:
25. Animations (modal slides, toast animations)
26. Keyboard handling (KeyboardAvoidingView)
27. SafeAreaView on all screens
28. Test all navigation flows

================================================================================
END OF SPECIFICATION
================================================================================