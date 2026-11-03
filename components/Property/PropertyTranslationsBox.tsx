"use client";

import { useEffect, useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";

import type { PropertyTranslationSection } from "@/interfaces/property-translations";
import type { PropertyTranslationsData } from "@/interfaces/property-translations";
import type { PropertyTranslationsForm } from "@/interfaces/property-translations";
import type { TranslationLocale } from "@/interfaces/property-translations";

import SubmitButton from "@/components/Form/SubmitButton";
import Loading from "@/components/shared/Loading";

type Props = { endpoint: string };

type FieldConfig = {
  name: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
};

const DESCRIPTION_LIMIT = 1024;

const SECTIONS: {
  section: PropertyTranslationSection;
  heading: string;
  fields: FieldConfig[];
}[] = [
  {
    section: "main",
    heading: "عنوان و آدرس ملک",
    fields: [
      { name: "title", label: "عنوان ملک", maxLength: 200 },
      { name: "address", label: "آدرس", maxLength: 1000, multiline: true },
    ],
  },
  {
    section: "host",
    heading: "نام میزبان",
    fields: [
      {
        name: "name",
        label: "نام میزبان",
        maxLength: 64,
        hint: "نامی که در صفحهٔ آگهی روی کارت میزبان نمایش داده می‌شود.",
      },
    ],
  },
  {
    section: "descriptions",
    heading: "توضیحات آگهی",
    fields: [
      {
        name: "ad_dscr",
        label: "توضیحات تبلیغاتی",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
        hint: "اگر پر باشد، در صفحهٔ آگهی به‌جای توضیحات ملک نمایش داده می‌شود.",
      },
      {
        name: "property_dscr",
        label: "توضیحات ملک",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "facility_dscr",
        label: "توضیحات امکانات (Amenities)",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "pattern_dscr",
        label: "محیط و مسیر دسترسی (Surroundings and access route)",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "distance_dscr",
        label: "فاصله تا مراکز مهم (Distance to points of interest)",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "guest_dscr",
        label: "توضیحات نوع مهمان",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "pet_dscr",
        label: "توضیحات پذیرش حیوان خانگی",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "party_dscr",
        label: "توضیحات برگزاری مراسم",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "doc_dscr",
        label: "مدارک لازم هنگام ورود (Documents required for check-in)",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
      {
        name: "other_dscr",
        label: "سایر شرایط اقامت (Other conditions for the stay)",
        maxLength: DESCRIPTION_LIMIT,
        multiline: true,
      },
    ],
  },
];

const LOCALES: {
  code: TranslationLocale;
  label: string;
  dir: "ltr" | "rtl";
}[] = [
  { code: "en", label: "English — انگلیسی", dir: "ltr" },
  { code: "ar", label: "العربية — عربی", dir: "rtl" },
];

const INPUT =
  "w-full rounded-md border bg-transparent p-3 text-sm disabled:opacity-70";

const emptyForm = (): PropertyTranslationsForm => ({
  main: {},
  host: {},
  descriptions: {},
});

const persianOf = (
  data: PropertyTranslationsData,
  section: PropertyTranslationSection,
  name: string
): string => {
  if (section === "host") return data.host.fa ?? "";
  const source: Record<string, string | null | undefined> =
    section === "main" ? data.main.fa : data.descriptions.fa;
  return source[name] ?? "";
};

type FieldInputProps = {
  dir: "ltr" | "rtl";
  lang: string;
  value: string;
  disabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  onChange?: (value: string) => void;
};

const FieldInput = ({ multiline, onChange, ...props }: FieldInputProps) =>
  multiline ? (
    <textarea
      {...props}
      rows={4}
      className={INPUT}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ) : (
    <input
      {...props}
      className={INPUT}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );

const PropertyTranslationsBox = ({ endpoint }: Props) => {
  const [data, setData] = useState<PropertyTranslationsData>();
  const [form, setForm] = useState<PropertyTranslationsForm>(emptyForm());
  const [disabled, setDisabled] = useState(false);

  const load = () =>
    ApiCall(
      "GET",
      `${endpoint}/translations`,
      null,
      "GET TRANSLATIONS",
      ({ data }: { data: PropertyTranslationsData }) => {
        setData(data);
        setForm({
          main: data.main.translations ?? {},
          host: data.host.translations ?? {},
          descriptions: data.descriptions.translations ?? {},
        });
      }
    );

  useEffect(() => {
    load();
  }, []);

  const setValue = (
    section: PropertyTranslationSection,
    locale: TranslationLocale,
    name: string,
    value: string
  ) =>
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [locale]: { ...current[section][locale], [name]: value },
      },
    }));

  const onSubmit = () => {
    setDisabled(true);
    ApiCall(
      "PUT",
      `${endpoint}/translations`,
      form,
      "UPDATE TRANSLATIONS",
      () => {
        setDisabled(false);
        load();
      },
      () => setDisabled(false)
    );
  };

  if (!data) return <Loading />;

  return (
    <section className="my-10 space-y-8" aria-labelledby="property-translations">
      <div>
        <h2 id="property-translations" className="text-lg font-bold">
          ترجمهٔ محتوای آگهی (انگلیسی و عربی)
        </h2>
        <p className="mt-2 text-sm opacity-80">
          متن فارسی را مالک آگهی وارد کرده و اینجا فقط خواندنی است. هر فیلدی که
          خالی بماند، در سایت انگلیسی و عربی همان متن فارسی نمایش داده می‌شود.
          برای ترجمهٔ امکانات و گزینه‌های ثابت (مثل استخر، شهرکی، آسفالت) از
          بخش «گزینه‌های ملک» استفاده کنید.
        </p>
      </div>

      {SECTIONS.map(({ section, heading, fields }) => {
        const visible = fields.filter(
          (field) =>
            section !== "descriptions" ||
            persianOf(data, section, field.name).trim()
        );
        if (!visible.length) return null;
        return (
          <fieldset key={section} disabled={disabled} className="space-y-6">
            <legend className="mb-2 font-medium">{heading}</legend>
            {visible.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-1 gap-3 rounded-lg border p-4 lg:grid-cols-3"
              >
                <label className="block text-sm">
                  <span className="mb-2 block font-medium">
                    {field.label} — فارسی
                  </span>
                  <FieldInput
                    dir="rtl"
                    lang="fa"
                    disabled
                    multiline={field.multiline}
                    value={persianOf(data, section, field.name)}
                  />
                  {field.hint ? (
                    <span className="mt-1 block text-xs opacity-70">
                      {field.hint}
                    </span>
                  ) : null}
                </label>
                {LOCALES.map(({ code, label, dir }) => {
                  const value = form[section][code]?.[field.name] ?? "";
                  return (
                    <label key={code} className="block text-sm">
                      <span className="mb-2 block font-medium">{label}</span>
                      <FieldInput
                        dir={dir}
                        lang={code}
                        value={value}
                        multiline={field.multiline}
                        maxLength={field.maxLength}
                        onChange={(text) =>
                          setValue(section, code, field.name, text)
                        }
                      />
                      <span className="mt-1 block text-xs opacity-60" dir="ltr">
                        {value.length}/{field.maxLength}
                      </span>
                    </label>
                  );
                })}
              </div>
            ))}
          </fieldset>
        );
      })}

      <div className="flow-root">
        <SubmitButton
          disabled={disabled}
          onPress={onSubmit}
          title="ذخیرهٔ ترجمه‌ها"
        />
      </div>
    </section>
  );
};

export default PropertyTranslationsBox;
