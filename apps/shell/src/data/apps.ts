export interface AppScreenshot {
  url: string;
  alt: string;
}

export const MOBILE_FRAMEWORKS = ['React Native', 'Flutter', 'Swift', 'Kotlin'] as const;

export function isMobileApp(framework: string): boolean {
  return MOBILE_FRAMEWORKS.some(f => f.toLowerCase() === framework.toLowerCase());
}

export interface AppInfo {
  id: string;
  name: string;
  path: string;
  framework: string;
  port: number;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  description: string;
  version: string;
  lastUpdated: string;
  screenshots: AppScreenshot[];
  detailContent: string;
  integrated?: boolean;
  iosAppUrl?: string;
  androidAppUrl?: string;
}
