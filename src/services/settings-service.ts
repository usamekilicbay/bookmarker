import { SETTINGS_STORAGE_KEY } from "../common/constants";

export function loadSettings(): ISettings {
  const value = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (value) {
    const tempSettings = JSON.parse(value) as ISettings;
    return tempSettings;
  }
  return { autoDelete: false } as ISettings;
}

export function saveSettings(settings: ISettings): void {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
