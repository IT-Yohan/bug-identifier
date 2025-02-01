import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async (params: any) => {
  // Retrieve the locale from request headers if available
  let currentLocale: string = "en";
  if (params && params.request) {
    const headers = await params.request.headers();
    currentLocale = headers.get("x-next-intl-locale") || "en";
  }
  const messages = (await import(`../messages/${currentLocale}/common.json`)).default;
  return {
    messages,
    timeZone: "Europe/Paris",
    now: new Date(),
    locale: currentLocale,
  };
});
