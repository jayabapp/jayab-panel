"use client";

import { useEffect, useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";

import type { PropertyTranslationSection } from "@/interfaces/property-translations";
import type { PropertyTranslationsData } from "@/interfaces/property-translations";
import type { PropertyTranslationsForm } from "@/interfaces/property-translations";
import type { TranslationLocale } from "@/interfaces/property-translations";

import SubmitButton from "@/components/Form/SubmitButton";
import Loading from "@/components/shared/Loading";
import CopyButton from "@/components/Form/CopyButton";

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
  "w-full rounded-md border bg-transparent p-3 text-base leading-8 disabled:opacity-70";

type PersianForm = Record<PropertyTranslationSection, Record<string, string>>;

const persianFormOf = (data: PropertyTranslationsData): PersianForm => ({
  main: { title: data.main.fa.title ?? "", address: data.main.fa.address ?? "" },
  host: { name: data.host.fa ?? "" },
  descriptions: { ...data.descriptions.fa },
});

/** Only the Persian fields the admin actually changed, in the API's `fa` shape. */
const changedPersian = (data: PropertyTranslationsData, edited: PersianForm) => {
  const original = persianFormOf(data);
  const changed = (section: PropertyTranslationSection, name: string) =>
    (edited[section][name] ?? "") !== (original[section][name] ?? "");
  const descriptions = Object.fromEntries(
    Object.keys(edited.descriptions)
      .filter((name) => changed("descriptions", name))
      .map((name) => [name, edited.descriptions[name]])
  );
  return {
    ...(changed("main", "title") ? { title: edited.main.title } : {}),
    ...(changed("main", "address") ? { address: edited.main.address } : {}),
    ...(changed("host", "name") ? { host_name: edited.host.name } : {}),
    ...(Object.keys(descriptions).length ? { descriptions } : {}),
  };
};

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
  "aria-label": string;
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
      rows={6}
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
  const [persian, setPersian] = useState<PersianForm>();
  const [disabled, setDisabled] = useState(false);

  const load = () =>
    ApiCall(
      "GET",
      `${endpoint}/translations`,
      null,
      "GET TRANSLATIONS",
      ({ data }: { data: PropertyTranslationsData }) => {
        setData(data);
        setPersian(persianFormOf(data));
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
    if (!data || !persian) return;
    setDisabled(true);
    const fa = changedPersian(data, persian);
    ApiCall(
      "PUT",
      `${endpoint}/translations`,
      Object.keys(fa).length ? { ...form, fa } : form,
      "UPDATE TRANSLATIONS",
      () => {
        setDisabled(false);
        load();
      },
      () => setDisabled(false)
    );
  };

  if (!data || !persian) return <Loading />;

  return (
    <section className="my-10 space-y-8" aria-labelledby="property-translations">
      <div>
        <h2 id="property-translations" className="text-lg font-bold">
          ترجمهٔ محتوای آگهی (انگلیسی و عربی)
        </h2>
        <p className="mt-2 text-base leading-8 opacity-80">
          متن فارسی را می‌توانید همین‌جا اصلاح کنید؛ با ذخیره، متن خود آگهی در
          سایت هم عوض می‌شود. عنوان، آدرس و نام میزبان خالی ذخیره نمی‌شوند. هر
          ترجمه‌ای که خالی بماند، در سایت انگلیسی و عربی همان متن فارسی نمایش
          داده می‌شود. برای ترجمهٔ امکانات و گزینه‌های ثابت (مثل استخر، شهرکی،
          آسفالت) از بخش «گزینه‌های ملک» استفاده کنید.
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
            <legend className="mb-2 text-lg font-medium">{heading}</legend>
            {visible.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-1 gap-3 rounded-lg border p-4 lg:grid-cols-3"
              >
                <div className="text-base">
                  <div className="mb-2 flex items-center justify-between gap-2 font-medium">
                    <span>{field.label} — فارسی</span>
                    <CopyButton text={persian[section][field.name] ?? ""} />
                  </div>
                  <FieldInput
                    aria-label={`${field.label} — فارسی`}
                    dir="rtl"
                    lang="fa"
                    multiline={field.multiline}
                    maxLength={field.maxLength}
                    value={persian[section][field.name] ?? ""}
                    onChange={(text) =>
                      setPersian((current) =>
                        current && {
                          ...current,
                          [section]: { ...current[section], [field.name]: text },
                        }
                      )
                    }
                  />
                  {field.hint ? (
                    <span className="mt-1 block text-sm opacity-70">
                      {field.hint}
                    </span>
                  ) : null}
                </div>
                {LOCALES.map(({ code, label, dir }) => {
                  const value = form[section][code]?.[field.name] ?? "";
                  return (
                    <div key={code} className="text-base">
                      <div className="mb-2 flex items-center justify-between gap-2 font-medium">
                        <span>{label}</span>
                        <CopyButton text={value} />
                      </div>
                      <FieldInput
                        aria-label={`${field.label} — ${label}`}
                        dir={dir}
                        lang={code}
                        value={value}
                        multiline={field.multiline}
                        maxLength={field.maxLength}
                        onChange={(text) =>
                          setValue(section, code, field.name, text)
                        }
                      />
                      <span className="mt-1 block text-sm opacity-60" dir="ltr">
                        {value.length}/{field.maxLength}
                      </span>
                    </div>
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
          title="ذخیرهٔ متن‌ها و ترجمه‌ها"
        />
      </div>
    </section>
  );
};

export default PropertyTranslationsBox;
