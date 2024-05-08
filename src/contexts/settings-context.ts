import { createContext, useContext } from "react";

export const SettingsContext = createContext<ISettings | undefined>(undefined);

export function useSettingsContext(): ISettings {
  const settingsContext = useContext(SettingsContext);

  if (settingsContext === undefined) {
    throw new Error("Settings Context is undefined");
  }

  return settingsContext;
}
