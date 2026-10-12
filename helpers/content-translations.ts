import type { ContentTranslations } from "@/interfaces/content-translations";

export const contentTranslationsError = (
  translations: ContentTranslations,
): string | null => {
  for (const locale of ["ar", "en"] as const) {
    const edition = translations[locale];
    if (!edition) continue;
    const fields = [
      edition.title,
      edition.small_text,
      edition.full_text,
      edition.seo?.metaTitle,
      edition.seo?.metaDescription,
    ];
    if (fields.some((text) => typeof text !== "string" || !text.trim())) {
      return `عنوان‌ها، شعار و توضیحات سئوی نسخهٔ ${locale === "ar" ? "عربی" : "انگلیسی"} را تکمیل کنید.`;
    }
  }
  return null;
};
