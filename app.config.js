export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    extra: {
      ...config.expo?.extra,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
});
