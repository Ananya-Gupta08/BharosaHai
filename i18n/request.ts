import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {routing} from "./routing";

const namespaces = [
  "common",
  "home",
  "about",
  "services",
  "partner",
  "provider",
  "admin",
  "contact",
  "faq",
] as const;

export async function getMessagesForLocale(locale: string) {
  const entries = await Promise.all(
    namespaces.map(async (namespace) => {
      const messages = (await import(`../messages/${locale}/${namespace}.json`)).default;
      return [namespace, messages] as const;
    })
  );

  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});
