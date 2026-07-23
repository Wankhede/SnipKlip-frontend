import { createContext, ReactNode } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, FontFamily, I18n, MenuOrientation, PresetColor, ThemeDirection, ThemeMode } from 'types/config';

// initial state
const initialState: CustomizationProps = {
  ...defaultConfig,
  onChangeContainer: () => {},
  onChangeLocalization: (lang: I18n) => {},
  onChangeMode: (mode: ThemeMode) => {},
  onChangePresetColor: (theme: PresetColor) => {},
  onChangeDirection: (direction: ThemeDirection) => {},
  onChangeMiniDrawer: (miniDrawer: boolean) => {},
  onChangeMenuOrientation: (menuOrientation: MenuOrientation) => {},
  onChangeFontFamily: (fontFamily: FontFamily) => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

const SUPPORTED_I18N: I18n[] = ['en', 'fr', 'ro', 'zh', 'mr', 'te', 'ta', 'hi'];

function sanitizeConfig(raw: CustomizationProps): CustomizationProps {
  const i18n = SUPPORTED_I18N.includes(raw?.i18n) ? raw.i18n : defaultConfig.i18n;
  return {
    ...defaultConfig,
    ...raw,
    i18n
  };
}

function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useLocalStorage('SnipKlip-react-next-ts-config-v2', initialState);
  const safeConfig = sanitizeConfig(config);

  const onChangeContainer = () => {
    setConfig({
      ...safeConfig,
      container: !safeConfig.container
    });
  };

  const onChangeLocalization = (lang: I18n) => {
    const nextLang = SUPPORTED_I18N.includes(lang) ? lang : 'en';
    setConfig({
      ...safeConfig,
      i18n: nextLang
    });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...safeConfig,
      mode
    });
  };

  const onChangePresetColor = (theme: PresetColor) => {
    setConfig({
      ...safeConfig,
      presetColor: theme
    });
  };

  const onChangeDirection = (direction: ThemeDirection) => {
    setConfig({
      ...safeConfig,
      themeDirection: direction
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...safeConfig,
      miniDrawer
    });
  };

  const onChangeMenuOrientation = (layout: MenuOrientation) => {
    setConfig({
      ...safeConfig,
      menuOrientation: layout
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...safeConfig,
      fontFamily
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        ...safeConfig,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeMenuOrientation,
        onChangeFontFamily
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };
