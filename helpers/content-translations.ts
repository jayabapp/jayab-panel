import type { ContentTranslations } from "@/interfaces/content-translations";

export const contentTranslationsError = (
  translations: ContentTranslations,
  contentKey: string = "homeContent",
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
      return `عنوان‌ها، توضیحات و سئوی نسخهٔ ${locale === "ar" ? "عربی" : "انگلیسی"} را تکمیل کنید.`;
    }
    if (
      contentKey === "terms" &&
      !edition.html
        ?.replace(/<[^>]*>/g, "")
        .replace(/&(?:nbsp|#160|#xA0);/gi, " ")
        .trim()
    ) {
      return `متن کامل قوانین نسخهٔ ${locale === "ar" ? "عربی" : "انگلیسی"} را وارد کنید.`;
    }
  }
  return null;
};
