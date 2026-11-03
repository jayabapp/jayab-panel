"use client";

import { useId } from "react";

export type TitleTranslations = Partial<Record<"ar" | "en", { title: string }>>;

export const prepareTitleTranslations = (
  value: TitleTranslations,
): TitleTranslations =>
  Object.fromEntries(
    (["ar", "en"] as const).flatMap((locale) => {
      const title = value[locale]?.title?.trim();
      return title ? [[locale, { title }]] : [];
    }),
  );

const LANGUAGES = [
  { code: "ar", label: "عنوان عربی", dir: "rtl" },
  { code: "en", label: "عنوان انگلیسی", dir: "ltr" },
] as const;

const TitleTranslationsEditor = ({
  value,
  onChange,
  disabled,
}: {
  value: TitleTranslations;
  onChange: (value: TitleTranslations) => void;
  disabled: boolean;
}) => {
  const id = useId();
  return (
    <fieldset disabled={disabled} className="my-5 space-y-3 col-span-full">
      <legend className="font-medium">ترجمه عنوان نمایشی</legend>
      <p className="text-sm opacity-80">
        عنوان اصلی، فارسی است. این ترجمه‌ها در سایت با انتخاب زبان نمایش داده
        می‌شوند. خالی گذاشتن هر زبان، ترجمه آن را حذف می‌کند و عنوان فارسی نمایش
        داده می‌شود. آدرس و فیلترهای جستجو مستقل از ترجمه هستند.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LANGUAGES.map(({ code, label, dir }) => (
          <div key={code} className="flex flex-col gap-2">
            <label htmlFor={`${id}-${code}`}>{label}</label>
            <input
              dir={dir}
              lang={code}
              type="text"
              maxLength={200}
              id={`${id}-${code}`}
              value={value[code]?.title ?? ""}
              className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2"
              onChange={(event) =>
                onChange({ ...value, [code]: { title: event.target.value } })
              }
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default TitleTranslationsEditor;
