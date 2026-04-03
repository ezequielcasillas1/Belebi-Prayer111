# Belebi Prayer Mobile Architecture Guide

Master context file for AI agents working on Belebi Prayer.

## Stack

React Native 0.83.2 + Expo SDK 55 + React 19.2 + TypeScript 5.9.2.
Navigation: React Navigation 7 (Native Stack + Drawer).
Styling: NativeWind 4.2.2 + Tailwind CSS 3.4.19.
Backend: Supabase + TanStack React Query 5 + AsyncStorage persister + Zustand 5.
UI: Lucide React Native, Reanimated 4.2.1, Gesture Handler, React Native Maps, Expo Linear Gradient, Toast Message.
Utilities: date-fns 4.1.0.

References:
- Expo SDK 55 / New Architecture: https://docs.expo.dev/guides/new-architecture/
- Expo SDK 55 upgrade notes: https://expo.dev/blog/upgrading-to-sdk-55
- React Navigation nesting: https://reactnavigation.org/docs/nesting-navigators/
- Supabase React Native auth: https://supabase.com/docs/guides/auth/quickstarts/react-native
- TanStack AsyncStorage persister: https://tanstack.com/query/v4/docs/react/plugins/createAsyncStoragePersister
- Zustand slices pattern: https://zustand.docs.pmnd.rs/learn/guides/advanced-typescript
- Reanimated performance: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/

## Golden Rules

1. IDs come from Supabase auth session or Postgres rows only. Never fabricate IDs in the app.
2. Screens stay thin. Business logic lives in feature hooks, query modules, stores, and services.
3. React Query owns server state. Zustand owns local UI/app state. Do not duplicate server entities in Zustand.
4. Supabase client is a singleton in `src/lib/supabase.ts` with AsyncStorage-based auth persistence.
5. Navigation config lives in `src/navigation/`; features do not create ad-hoc navigators.
6. Reanimated worklets stay close to animated UI, not in data modules.
7. One feature = one folder with its own components, hooks, queries, mutations, store, types, and screen adapters.
8. Expo SDK 55 always runs on React Native's New Architecture; do not add legacy-architecture workarounds.

## Directory Shape

```text
src/
  app/                 # providers, bootstrap, app entry wiring
  navigation/          # root navigator, typed params, deep linking
  lib/                 # supabase, query client, env, date helpers
  shared/              # reusable UI, hooks, utils, constants
  features/
    auth/
    prayer-times/
    qibla/
    mosque-map/
    subscription/
    settings/
  services/            # cross-feature integrations only
  types/               # app-wide TS primitives
```

## Skill Map

- `id-management` for any `id`, `userId`, or record identifiers.
- `feature-module` for new features and folder layout.
- `navigation-patterns` for stacks, drawers, nesting, and typed routes.
- `supabase-auth` for auth, sessions, persistence, and backend access.
- `react-query-persistence` for fetching, mutations, cache, offline persistence.
- `zustand-boundaries` for local state slices.
- `reanimated-patterns` for animations and gesture-driven UI.
- `maps-location` for map, coordinates, permissions, and geospatial UX.
- `ui-conventions` for NativeWind, icons, gradients, toasts, and screen composition.
- `core-conventions` for naming, imports, file sizes, and TypeScript patterns.
