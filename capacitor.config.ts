import type { CapacitorConfig } from '@capacitor/cli';

// The APK bundles the built site (dist/) and serves it from the app's own
// local WebView origin — no hosting dependency, no network. Build the web
// assets WITHOUT a base path (plain `npm run build`) before `cap sync`.
const config: CapacitorConfig = {
  appId: 'org.grayskl.puente',
  appName: 'Puente la Divide',
  webDir: 'dist',
};

export default config;
