# Belebi Prayer Architecture Reference

This guide defines the recommended modular architecture for Belebi Prayer on React Native + Expo.

References:
- Expo SDK 55 uses React Native 0.83 and always runs on the New Architecture: https://docs.expo.dev/guides/new-architecture/
- Expo SDK 55 upgrade notes: https://expo.dev/blog/upgrading-to-sdk-55
- React Navigation nested navigators: https://reactnavigation.org/docs/nesting-navigators/
- Supabase React Native auth with AsyncStorage and AppState refresh: https://supabase.com/docs/guides/auth/quickstarts/react-native
- Supabase React Native auth article: https://supabase.com/blog/react-native-authentication
- TanStack AsyncStorage persister: https://tanstack.com/query/v4/docs/react/plugins/createAsyncStoragePersister
- TanStack persist client notes: https://www.mintlify.com/tanstack/query/plugins/persist-client
- Zustand slices pattern: https://zustand.docs.pmnd.rs/learn/guides/advanced-typescript
- Reanimated performance guidance: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/

## Why this shape

Expo SDK 55 runs fully on React Native's New Architecture, so the app should lean into modern library patterns instead of carrying legacy compatibility structure. React Navigation nested navigators maintain their own history and options, which makes shallow, intentional navigation trees easier to reason about. Supabase's React Native guidance centers auth persistence around AsyncStorage and foreground-triggered token refresh. TanStack Query supports AsyncStorage persistence, which is a strong fit for mobile reopen and offline-adjacent UX. Zustand's documented slices pattern fits local UI state well when kept separate from server data.

## Top-level structure

```text
src/
  app/
    app.tsx
    providers.tsx
    bootstrap.ts
  navigation/
    root-navigator.tsx
    auth-stack.tsx
    app-drawer.tsx
    home-stack.tsx
    linking.ts
    types.ts
  lib/
    supabase.ts
    query-client.ts
    env.ts
    date.ts
  shared/
    components/
      screen.tsx
      screen-header.tsx
      error-state.tsx
      loading-state.tsx
    hooks/
    utils/
    constants/
  features/
    auth/
    prayer-times/
    qibla/
    mosque-map/
    subscription/
    settings/
  services/
    notifications/
    location/
  types/
    api.ts
    domain.ts
```

## Feature slice example

```text
src/features/subscription/
  api/
    get-subscription.ts
    create-checkout.ts
  components/
    paywall-card.tsx
    subscription-badge.tsx
  hooks/
    use-subscription.ts
    use-start-checkout.ts
  screens/
    subscription.screen.tsx
  store/
    paywall-ui.store.ts
  types.ts
  index.ts
```

Each feature folder owns its API calls, React Query hooks, presentational components, optional local store, screen adapters, and types. Shared code moves out only after it is reused by at least two features.

## State ownership matrix

| Data / concern | Owner | Why |
|---|---|---|
| Supabase profile row | React Query | Server state, should refetch and cache |
| Prayer times fetched from backend | React Query | Server state with stale/cache lifecycle |
| Current user session | Supabase client + auth listener | Auth source of truth |
| Selected calculation method | Zustand | Local preference / UI state |
| Qibla calibration sheet open/closed | Zustand or component state | Local interactive state |
| Drawer open state | React Navigation | Navigation-owned state |
| Map camera / selected marker | screen state + small local store | UI interaction state |

## Navigation recommendation

Keep the auth boundary at the root, with drawer-level top navigation for signed-in users and per-feature stack navigators under the drawer.

```text
RootStack
  SplashGate
  AuthStack
    Welcome
    SignIn
    OtpVerify
  AppDrawer
    HomeStack
      Home
      PrayerTimes
      PrayerSettings
    QiblaStack
      QiblaCompass
    MapStack
      MosqueMap
      MosqueDetail
    SubscriptionStack
      Subscription
    SettingsStack
      Settings
      Profile
```

This shape matches React Navigation guidance that nested navigators maintain separate histories and option ownership, which is clearer when nesting is intentional and shallow.

## Providers bootstrap

```tsx
// src/app/providers.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        {children}
        <Toast />
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  )
}
```

## Supabase bootstrap

Use one singleton client in `src/lib/supabase.ts`. Supabase's React Native quickstart shows AsyncStorage persistence, `detectSessionInUrl: false`, `processLock`, and AppState-controlled token refresh for foreground activity. Register auth listeners once in app bootstrap and fan out only the minimum derived state needed by the UI.

## Query policy

Use one query key factory per feature. Persist only useful caches. Do not persist everything blindly if it bloats AsyncStorage. Mutation success should normally invalidate the relevant query key and let React Query own server reconciliation.

```ts
export const prayerKeys = {
  all: ['prayer-times'] as const,
  byDate: (date: string) => ['prayer-times', date] as const,
}
```

## Zustand policy

Use slices for local-only state. Example slices for Belebi Prayer:
- `prayer-settings.store.ts` for calculation method and local display preferences
- `onboarding.store.ts` for current onboarding step
- `map-ui.store.ts` for selected marker id, filter chips, and sheet state
- `subscription-ui.store.ts` for paywall visibility only

Do not use Zustand as a second normalized database.

## Animation policy

Use Reanimated for motion that benefits from worklets or native-thread execution: compass rotation, drawer micro-interactions, collapsible prayer cards, map bottom sheets, and gesture-based panels. Keep animations in component-local files or `*.animation.ts` helpers and avoid mixing them with network logic.

## Example feature flow: prayer times

```text
prayer-times.screen.tsx
  -> usePrayerTimes(date)
    -> getPrayerTimes(date)
      -> supabase rpc/select
  -> usePrayerSettingsStore()
  -> PrayerTimesView
     -> NextPrayerBanner
     -> PrayerTimeCard list
```

This keeps the screen thin, server state in React Query, local preferences in Zustand, and rendering in components.

## Example feature flow: subscription

```text
subscription.screen.tsx
  -> useSubscription()
    -> getSubscription()
      -> supabase.from('subscriptions')
  -> useStartCheckout()
    -> call Edge Function / server endpoint
  -> open checkout / handle return
```

The client never fabricates subscription IDs; it reads them from Supabase / Stripe-backed rows.

## File sizing guidance

- Screens: aim for 80-150 lines.
- Hooks: one concern each.
- Components: split when a component has multiple visual regions or mixed responsibilities.
- API files: one endpoint / operation each.
- Avoid giant `utils.ts`, giant `store.ts`, or giant `navigation.tsx` files.
