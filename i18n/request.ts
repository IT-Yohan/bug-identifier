import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
    const resolvedLocale = await requestLocale;
    if (!resolvedLocale) {
        return {
            messages: {},
            timeZone: "Europe/Paris",
            now: new Date(),
            locale: 'en',
        };
    }

    const messages = (await import(`../messages/${resolvedLocale}/common.json`)).default;
    return {
        messages,
        timeZone: "Europe/Paris",
        now: new Date(),
        locale: resolvedLocale,
    };
});