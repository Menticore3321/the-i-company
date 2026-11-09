import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theicompany.app',
  appName: 'The I Company',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://theicompany.netlify.app',
    cleartext: true
  }
};

export default config;
