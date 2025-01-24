import {getRequestConfig} from 'next-intl/server';
import {locales} from '../middleware';

export default getRequestConfig(async ({locale}) => {
  const messages = (await import(`../messages/${locale}/common.json`)).default;
  
  return {
    messages: {
      common: messages
    },
    timeZone: 'Europe/Paris'
  };
});
