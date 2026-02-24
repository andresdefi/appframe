export interface UploadResult {
  platform: 'ios' | 'android';
  locale: string;
  displayType: string;
  uploaded: string[];
  skipped: string[];
  errors: string[];
}

export interface UploadOptions {
  configPath: string;
  platform?: 'ios' | 'android';
  locale?: string;
  dryRun?: boolean;
  outputDir?: string;
}

// App Store Connect

export interface AppStoreConnectCredentials {
  issuerId: string;
  keyId: string;
  privateKey: string;
}

export interface AppStoreConnectUploadOptions {
  credentials: AppStoreConnectCredentials;
  appId: string;
  versionId?: string;
  locale: string;
  displayType: AppStoreDisplayType;
  screenshotPaths: string[];
  dryRun?: boolean;
}

export type AppStoreDisplayType =
  | 'APP_IPHONE_67'
  | 'APP_IPHONE_65'
  | 'APP_IPAD_PRO_3GEN_129'
  | 'APP_IPAD_PRO_129';

// Google Play

export interface GooglePlayCredentials {
  serviceAccountJson: string;
}

export interface GooglePlayUploadOptions {
  credentials: GooglePlayCredentials;
  packageName: string;
  editId?: string;
  locale: string;
  imageType: GooglePlayImageType;
  screenshotPaths: string[];
  dryRun?: boolean;
}

export type GooglePlayImageType =
  | 'phoneScreenshots'
  | 'sevenInchScreenshots'
  | 'tenInchScreenshots'
  | 'featureGraphic';
