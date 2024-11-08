// app/[locale]/layout.tsx

import Header from "@/app/_components/Header";
import "@/app/globals.css";
import { locales } from "@/i18n.config";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import useTextDirection from "@/app/_hooks/useTextDirection";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Layout.metaData",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LocaleLayout({
  children,
  params: {
    locale
  },
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  unstable_setRequestLocale(locale);
  /* Make sure this comes after the
   * unstable_setRequestLocale call
   * to avoid build errors.
   */
  const dir = useTextDirection();

  return (
    <html lang={locale} dir={dir}>
      <body className="mx-auto w-[500px] bg-slate-950 px-6 pt-3 text-sky-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
