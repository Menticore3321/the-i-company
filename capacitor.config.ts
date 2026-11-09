import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theicompany.app',
  appName: 'The I Company',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

