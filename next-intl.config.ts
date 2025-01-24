import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}/common.json`)).default,
  timeZone: 'Europe/Paris',
  now: new Date()
}));