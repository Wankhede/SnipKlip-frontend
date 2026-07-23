/* eslint-disable */
import { ReactNode, useEffect, useState } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// project import
import useConfig from 'hooks/useConfig';
import { I18n } from 'types/config';
import enMessages from 'utils/locales/en.json';

type MessageCatalog = Record<string, string> | Record<string, MessageFormatElement[]>;

const SUPPORTED_LOCALES: I18n[] = ['en', 'fr', 'ro', 'zh', 'mr', 'te', 'ta', 'hi'];

// load locales files (always merge over English so missing keys never blank the UI)
const loadLocaleData = (locale: I18n) => {
  switch (locale) {
    case 'fr':
      return import('utils/locales/fr.json');
    case 'ro':
      return import('utils/locales/ro.json');
    case 'zh':
      return import('utils/locales/zh.json');
    case 'hi':
      return import('utils/locales/hi.json');
    case 'mr':
      return import('utils/locales/mr.json');
    case 'ta':
      return import('utils/locales/ta.json');
    case 'te':
      return import('utils/locales/te.json');
    case 'en':
    default:
      return import('utils/locales/en.json');
  }
};

const normalizeLocale = (locale: string | undefined | null): I18n => {
  if (locale && (SUPPORTED_LOCALES as string[]).includes(locale)) {
    return locale as I18n;
  }
  return 'en';
};

// ==============================|| LOCALIZATION ||============================== //

interface Props {
  children: ReactNode;
}

const Locales = ({ children }: Props) => {
  const { i18n } = useConfig();
  const locale = normalizeLocale(i18n);

  // Seed with English so the app never unmounts during async locale swaps
  const [messages, setMessages] = useState<MessageCatalog>(enMessages as MessageCatalog);

  useEffect(() => {
    let cancelled = false;
    loadLocaleData(locale)
      .then((d: { default: MessageCatalog | undefined }) => {
        if (cancelled) return;
        const loaded = d?.default || {};
        // English fallback prevents missing-key / incomplete-catalog crashes & blank labels
        setMessages({ ...(enMessages as MessageCatalog), ...loaded } as MessageCatalog);
      })
      .catch(() => {
        if (!cancelled) {
          setMessages(enMessages as MessageCatalog);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={messages}
      onError={() => {
        /* Missing / malformed messages must not crash the tree during language switches */
      }}
    >
      {children as React.ReactElement}
    </IntlProvider>
  );
};

export default Locales;
