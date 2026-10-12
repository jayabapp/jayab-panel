"use client";

import { useId } from "react";

import type { Dispatch, SetStateAction } from "react";
import type { ContentTranslations } from "@/interfaces/content-translations";
import type { ContentTranslation } from "@/interfaces/content-translations";

import RichTextEditor from "@/components/RichTextEditor";

type Props = {
  disabled: boolean;
  value: ContentTranslations;
  contentKey: "homeContent" | "terms";
  onChange: Dispatch<SetStateAction<ContentTranslations>>;
};

const LANGUAGES = [
  { code: "ar", label: "العربية — عربی", dir: "rtl" },
  { code: "en", label: "English — انگلیسی", dir: "ltr" },
] as const;

const emptyEdition = (): ContentTranslation => ({
  title: "",
  small_text: "",
  full_text: "",
  html: "",
  seo: { metaTitle: "", metaDescription: "" },
});

const ContentTranslationsEditor = ({
  contentKey,
  value,
  onChange,
  disabled,
}: Props) => {
  const id = useId();
  const isTerms = contentKey === "terms";

  const update = (
    locale: "ar" | "en",
    field: keyof ContentTranslation,
    text: string,
  ) => {
    onChange((current) => ({
      ...current,
      [locale]: { ...(current[locale] ?? emptyEdition()), [field]: text },
    }));
  };

  const updateSeo = (
    locale: "ar" | "en",
    field: "metaTitle" | "metaDescription",
    text: string,
  ) => {
    onChange((current) => {
      const edition = current[locale] ?? emptyEdition();
      return {
        ...current,
        [locale]: { ...edition, seo: { ...edition.seo, [field]: text } },
      };
    });
  };

  return (
    <section className="my-6 space-y-4" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="font-medium text-lg">
        {isTerms ? "ترجمه‌های قوانین و مقررات" : "ترجمه‌های صفحه اصلی"}
      </h2>
      <p className="text-sm opacity-80">
        محتوای فارسی را در فیلدهای اصلی ویرایش کنید. هر زبان، عنوان، توضیحات،
        متن و سئوی مستقل دارد. برای انتشار ترجمه، تمام عنوان‌ها و توضیحات سئوی
        آن زبان را تکمیل کنید.
        {isTerms && " متن کامل قوانین هر زبان نیز باید تکمیل شود."}
        {" برداشتن تیک نسخهٔ زبان و ذخیره، ترجمهٔ آن زبان را حذف می‌کند."}
      </p>
      {LANGUAGES.map(({ code, label, dir }) => {
        const edition = value[code];
        return (
          <details key={code} className="border rounded-lg p-4" open>
            <summary className="cursor-pointer font-medium" lang={code}>
              {label}
            </summary>
            <label className="my-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!edition}
                disabled={disabled}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  onChange((current) => {
                    const next = { ...current };
                    if (enabled) next[code] = emptyEdition();
                    else delete next[code];
                    return next;
                  });
                }}
              />
              انتشار نسخهٔ {code === "ar" ? "عربی" : "انگلیسی"}
            </label>
            {edition ? (
              <fieldset disabled={disabled} className="space-y-4">
                {(
                  [
                    ["title", "عنوان محتوا", 200],
                    [
                      "small_text",
                      isTerms ? "عنوان صفحه قوانین" : "عنوان بخش پایین صفحه",
                      1000,
                    ],
                    [
                      "full_text",
                      isTerms ? "توضیحات قوانین" : "شعار بنر بالای صفحه",
                      2000,
                    ],
                  ] as const
                ).map(([field, title, maxLength]) => (
                  <label key={field} className="block text-sm">
                    <span className="block mb-2">{title}</span>
                    <input
                      className="w-full rounded-md border bg-transparent p-3"
                      dir={dir}
                      lang={code}
                      value={edition[field]}
                      maxLength={maxLength}
                      required
                      onChange={(event) =>
                        update(code, field, event.target.value)
                      }
                    />
                  </label>
                ))}
                <RichTextEditor
                  key={code}
                  value={edition.html}
                  title={isTerms ? "متن کامل قوانین و مقررات" : "متن صفحه"}
                  onChangeText={(html: string) => update(code, "html", html)}
                  options={{ direction: dir, immediateChanges: true, disabled }}
                />
                {(["metaTitle", "metaDescription"] as const).map((field) => (
                  <label key={field} className="block text-sm">
                    <span className="block mb-2">
                      {field === "metaTitle" ? "عنوان سئو" : "توضیحات سئو"}
                    </span>
                    <textarea
                      required
                      dir={dir}
                      lang={code}
                      value={edition.seo[field]}
                      rows={field === "metaTitle" ? 2 : 3}
                      maxLength={field === "metaTitle" ? 200 : 1000}
                      className="w-full rounded-md border bg-transparent p-3"
                      onChange={(event) =>
                        updateSeo(code, field, event.target.value)
                      }
                    />
                  </label>
                ))}
              </fieldset>
            ) : (
              <p className="text-sm opacity-80">
                این زبان هنوز محتوای اختصاصی ندارد.
              </p>
            )}
          </details>
        );
      })}
    </section>
  );
};

export default ContentTranslationsEditor;
