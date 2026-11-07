"use client";

import CopyButton from "@/components/Form/CopyButton";

import type { ChangeEvent } from "react";

export type TextTranslations = Partial<
  Record<"ar" | "en", Record<string, string | undefined>>
>;

export type TranslatedField = {
  name: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
};

/** Plan texts owners and advisors see on the subscription page. */
export const PLAN_TRANSLATED_FIELDS: TranslatedField[] = [
  { name: "title", label: "عنوان پلن", maxLength: 200 },
  { name: "ribbon_title", label: "عنوان ربان", maxLength: 100 },
  { name: "description", label: "توضیحات", maxLength: 10000, multiline: true },
];

/** Category texts shown on the site, e.g. the contact page and the listing rules step. */
export const CATEGORY_TRANSLATED_FIELDS: TranslatedField[] = [
  { name: "title", label: "عنوان دسته", maxLength: 200 },
  { name: "description", label: "توضیحات", maxLength: 10000, multiline: true },
];

const LANGUAGES = [
  { code: "en", label: "English — انگلیسی", dir: "ltr" },
  { code: "ar", label: "العربية — عربی", dir: "rtl" },
] as const;

const INPUT =
  "w-full rounded-md border bg-transparent p-3 text-base leading-8 disabled:opacity-70";

const toText = (value: unknown) =>
  typeof value === "string" ? value : value == null ? "" : String(value);

/** Reads the stored editions from a show-props response (`state: "translations"`). */
export const translationsFromShowProps = (
  showProps?: { state?: string; value?: unknown }[],
): TextTranslations =>
  (showProps?.find((item) => item.state === "translations")?.value as
    | TextTranslations
    | undefined) ?? {};

/**
 * English and Arabic editions of a record's texts, beside the Persian text from the form above.
 * A blank box means "not translated": the site shows the Persian text for that field.
 */
const TextTranslationsEditor = ({
  title,
  fields,
  persian,
  value,
  onChange,
  disabled,
}: {
  title: string;
  fields: TranslatedField[];
  persian: Record<string, unknown>;
  value: TextTranslations;
  onChange: (value: TextTranslations) => void;
  disabled?: boolean;
}) => (
  <fieldset disabled={disabled} className="my-8 space-y-6 col-span-full">
    <legend className="text-lg font-bold">{title}</legend>
    <p className="text-base leading-8 opacity-80">
      متن فارسی از فرم بالا خوانده می‌شود. هر باکسی که خالی بماند، در سایت
      انگلیسی و عربی همان متن فارسی نمایش داده می‌شود.
    </p>
    {fields.map((field) => {
      const persianText = toText(persian[field.name]);
      return (
        <div
          key={field.name}
          className="grid grid-cols-1 gap-3 rounded-lg border p-4 lg:grid-cols-3"
        >
          <div className="text-base">
            <div className="mb-2 flex items-center justify-between gap-2 font-medium">
              <span>{field.label} — فارسی</span>
              <CopyButton text={persianText} />
            </div>
            <div
              dir="rtl"
              lang="fa"
              className={`${INPUT} min-h-14 whitespace-pre-wrap opacity-80`}
            >
              {persianText || "—"}
            </div>
          </div>
          {LANGUAGES.map(({ code, label, dir }) => {
            const text = value[code]?.[field.name] ?? "";
            const props = {
              dir,
              lang: code,
              value: text,
              maxLength: field.maxLength,
              "aria-label": `${field.label} — ${label}`,
              className: INPUT,
              onChange: (
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) =>
                onChange({
                  ...value,
                  [code]: { ...value[code], [field.name]: event.target.value },
                }),
            };
            return (
              <div key={code} className="text-base">
                <div className="mb-2 flex items-center justify-between gap-2 font-medium">
                  <span>{label}</span>
                  <CopyButton text={text} />
                </div>
                {field.multiline ? (
                  <textarea rows={6} {...props} />
                ) : (
                  <input type="text" {...props} />
                )}
                <span className="mt-1 block text-sm opacity-60" dir="ltr">
                  {text.length}/{field.maxLength}
                </span>
              </div>
            );
          })}
        </div>
      );
    })}
  </fieldset>
);

export default TextTranslationsEditor;
