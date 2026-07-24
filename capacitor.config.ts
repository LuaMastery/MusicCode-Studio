/**
 * capacitor.config.ts — configuração do Capacitor.
 *
 * O mesmo build web (dist/) vira um app nativo Android/iOS.
 * Como o Vite usa viteSingleFile(), o dist/ contém um index.html autossuficiente,
 * o que funciona perfeitamente dentro do WebView do Capacitor.
 *
 * Para gerar o app:
 *   npm run build
 *   npx cap add android     # ou: npx cap add ios
 *   npx cap sync
 *   npx cap open android    # abre no Android Studio → Build APK
 */
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.musiccode.studio",
  appName: "MusicCode Studio",
  webDir: "dist",
  backgroundColor: "#0a0a14",
  android: {
    backgroundColor: "#0a0a14",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
