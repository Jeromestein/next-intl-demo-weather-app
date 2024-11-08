import type { WeeklyWeatherRoot } from "@/types";
import { promises as fs } from "fs";
import { getTranslations, getFormatter, unstable_setRequestLocale } from "next-intl/server";

export default async function Week({
    params: { locale },
}: Readonly<{ params: { locale: string } }>) {
    unstable_setRequestLocale(locale);

    const fileContents = await fs.readFile(
        `${process.cwd()}/app/_data/week.json`,
        "utf-8",
    );
    const { weeklyWeather } = JSON.parse(
        fileContents,
    ) as WeeklyWeatherRoot;
    /*
     * next-intl provides an async drop-in replacement for useTranslations 
     * called getTranslations.
     */
    const t = await getTranslations("Week");
    const format = await getFormatter();
    const temperatureUnit =
        locale === "en-us" ? "fahrenheit" : "celsius";

    return (
        <main>
            <h1 className="text-xs font-thin">
                {t("title")}
            </h1>
            <p className="w-max rounded-md bg-red-900 px-2 py-1 text-xs text-red-100">
                {t("alertCount", { count: 3 })}
            </p>
            <div className="divide-y divide-dashed divide-sky-900">
                {weeklyWeather.map((day) => (
                    <section key={day.dateTime} className="py-5">
                        <h2 className="mb-1 text-lg font-thin">
                            {t("dayDate", {
                                dayDate: new Date(day.dateTime),
                            })}
                        </h2>
                        <div>
                            <div className="flex items-baseline gap-3">
                                <p className="relative top-1 text-4xl">
                                    {day.conditionIcon}
                                </p>
                                <p className="text-3xl font-light">
                                    {/* "sunny" | "partlyCloudy" | ... */}
                                    {t(day.condition)}
                                </p>
                                <p className="text-3xl font-thin">
                                    {format.number(day.temperature[temperatureUnit], {
                                        style: 'unit',
                                        unit: temperatureUnit === 'celsius' ? 'celsius' : 'fahrenheit',
                                        maximumFractionDigits: 0
                                    })}
                                </p>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}