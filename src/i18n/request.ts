import { getRequestConfig } from 'next-intl/server';

const SUPPORTED_LOCALES = ['vi', 'en'] as const;
const DEFAULT_LOCALE = 'vi';

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale =
    requestedLocale && SUPPORTED_LOCALES.includes(requestedLocale as (typeof SUPPORTED_LOCALES)[number])
      ? requestedLocale
      : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
