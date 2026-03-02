# AI Reconnection Guide

If you decide to bring back AI-generated prayer features in the future, here are the screens and locations where AI functionality was previously implemented and where it could be re-added.

---

## Screens That Had AI Features

### 1. PlanPrayerScreen
**Purpose:** Users save a prayer request to come back to within 24 hours.

**Where AI was used:** When composing a prayer for the planned request, users had a "Generate AI Prayer Draft" button that would create a pre-written prayer they could use or edit.

**How to reconnect AI:**
- Add a button below the "Write Prayer" button that triggers an AI service call
- The AI should receive the prayer request text and generate a compassionate, personalized prayer response
- Display the generated text in the prayer input field for the user to review and edit before submitting

---

### 2. PrayerProfileScreen
**Purpose:** Viewing a specific prayer request's full details before deciding to pray.

**Where AI was used:** Two locations had AI buttons:
- A "Generate AI Prayer Draft Now" button in the action area (before composing)
- An "AI Draft" button inside the compose panel (while writing)

**How to reconnect AI:**
- The primary AI button should appear as an alternative to manually writing
- The secondary AI button should be available while composing, in case the user wants inspiration mid-writing
- The AI should take the requester's name, their request text, and optionally their country/denomination to generate a contextually appropriate prayer

---

### 3. CreateRequestScreen
**Purpose:** Users submitting their own prayer requests to the community.

**Where AI was used:** Next to the "Prayer Request" label, there was an "AI Draft" button that would generate a sample prayer request text for the user.

**How to reconnect AI:**
- Add a small button or link near the prayer request text input
- The AI should help users articulate their prayer need if they struggle to put it into words
- Consider making this a "Help me write" feature that asks clarifying questions or suggests structure

---

## Screens That Could Benefit from New AI Features

### 4. ChurchDetailScreen (New)
**Potential AI use:** When church members respond to each other's prayer requests, AI could help generate thoughtful prayers based on the specific request context.

### 5. LivePrayerRoomScreen
**Potential AI use:** AI could suggest prayer prompts or help users formulate prayers for the nation being prayed for, using contextual information about that country's needs.

---

## Data Considerations

Previously, the AI drafts were stored in `mockData.ts` as static arrays:
- `AI_PRAYER_DRAFTS` - Three pre-written prayers for responding to requests
- `AI_REQUEST_DRAFTS` - Three pre-written templates for creating requests

For a real AI implementation, you would need:
- An AI service (OpenAI, Anthropic, etc.) API key stored securely
- A backend endpoint or edge function to call the AI (to keep API keys secure)
- Rate limiting to prevent abuse
- Content moderation to ensure generated prayers are appropriate

---

## Implementation Priority

If reconnecting AI, consider this order:

1. **PrayerProfileScreen** - Highest impact, this is where users most need help writing prayers for others
2. **PlanPrayerScreen** - Same feature, just in a different context
3. **CreateRequestScreen** - Lower priority, users typically know what they want to pray about
4. **ChurchDetailScreen** - New opportunity for community-specific AI assistance

---

## User Experience Notes

When AI was removed, the "Write Prayer" buttons were kept but the AI alternatives were removed. The UI still works cleanly without AI. If re-adding AI:

- Make AI optional, not the default path
- Always allow users to edit AI-generated content before submitting
- Consider adding a small disclaimer that the prayer was AI-assisted
- Give users the choice to write manually or use AI help
