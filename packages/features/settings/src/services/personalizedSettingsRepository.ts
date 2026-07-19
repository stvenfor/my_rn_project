import {storage} from '@core/storage';

const PREFIX = 'personalized_settings.';

export type EyeProtectionMode = '关闭' | '开启' | '跟随系统';

export interface PersonalizedSettingsState {
  teachingMode: boolean;
  contentRecommendation: boolean;
  adRecommendation: boolean;
  oralScoring: boolean;
  cellularVideoReminder: boolean;
  uploadStatusMonitor: boolean;
  eyeProtectionMode: EyeProtectionMode;
}

export const EYE_PROTECTION_OPTIONS: EyeProtectionMode[] = [
  '关闭',
  '开启',
  '跟随系统',
];

export const DEFAULT_PERSONALIZED_SETTINGS: PersonalizedSettingsState = {
  teachingMode: false,
  contentRecommendation: true,
  adRecommendation: true,
  oralScoring: true,
  cellularVideoReminder: false,
  uploadStatusMonitor: false,
  eyeProtectionMode: '关闭',
};

async function readBool(key: string, defaultValue: boolean): Promise<boolean> {
  const raw = await storage.getItem(`${PREFIX}${key}`);
  if (raw == null) {
    return defaultValue;
  }
  return raw === 'true' || raw === '1';
}

async function writeBool(key: string, value: boolean): Promise<void> {
  await storage.setItem(`${PREFIX}${key}`, value ? 'true' : 'false');
}

function isEyeProtectionMode(value: string): value is EyeProtectionMode {
  return (EYE_PROTECTION_OPTIONS as string[]).includes(value);
}

export async function loadPersonalizedSettings(): Promise<PersonalizedSettingsState> {
  const eyeRaw = await storage.getItem(`${PREFIX}eye_protection_mode`);
  return {
    teachingMode: await readBool('teaching_mode', false),
    contentRecommendation: await readBool('content_recommendation', true),
    adRecommendation: await readBool('ad_recommendation', true),
    oralScoring: await readBool('oral_scoring', true),
    cellularVideoReminder: await readBool('cellular_video_reminder', false),
    uploadStatusMonitor: await readBool('upload_status_monitor', false),
    eyeProtectionMode:
      eyeRaw && isEyeProtectionMode(eyeRaw)
        ? eyeRaw
        : DEFAULT_PERSONALIZED_SETTINGS.eyeProtectionMode,
  };
}

const BOOL_STORAGE_KEYS: Record<
  keyof Omit<PersonalizedSettingsState, 'eyeProtectionMode'>,
  string
> = {
  teachingMode: 'teaching_mode',
  contentRecommendation: 'content_recommendation',
  adRecommendation: 'ad_recommendation',
  oralScoring: 'oral_scoring',
  cellularVideoReminder: 'cellular_video_reminder',
  uploadStatusMonitor: 'upload_status_monitor',
};

export async function persistPersonalizedBool(
  key: keyof Omit<PersonalizedSettingsState, 'eyeProtectionMode'>,
  value: boolean,
): Promise<void> {
  await writeBool(BOOL_STORAGE_KEYS[key], value);
}

export async function persistEyeProtectionMode(
  value: EyeProtectionMode,
): Promise<void> {
  await storage.setItem(`${PREFIX}eye_protection_mode`, value);
}
