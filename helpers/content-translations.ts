import type { ContentTranslationBase } from "@/interfaces/content-translations";
import type { ContentTranslations } from "@/interfaces/content-translations";

const LOCALES = ["ar", "en"] as const;

const isFilled = (text: unknown): text is string =>
  typeof text === "string" && !!text.trim();

const hasBody = (html: unknown) =>
  isFilled(
    typeof html === "string"
      ? html.replace(/<[^>]*>/g, "").replace(/&(?:nbsp|#160|#xA0);/gi, " ")
      : "",
  );

/**
 * A translation must cover every part the Persian original uses, the same rule the
 * Back applies before publishing it. Short entries (link titles, footer copy) need
 * only a title and text; pages also need their body and SEO.
 */
export const translationNeeds = (base: ContentTranslationBase) => ({
  small_text: isFilled(base.small_text),
  full_text: isFilled(base.full_text),
  html: isFilled(base.html),
  seo: isFilled(base.seo?.metaTitle) || isFilled(base.seo?.metaDescription),
});

export const contentTranslationsError = (
  translations: ContentTranslations,
  base: ContentTranslationBase,
): string | null => {
  const needs = translationNeeds(base);
  for (const locale of LOCALES) {
    const edition = translations[locale];
    if (!edition) continue;
    const language = locale === "ar" ? "عربی" : "انگلیسی";
    const texts = [
      edition.title,
      ...(needs.small_text ? [edition.small_text] : []),
      ...(needs.full_text ? [edition.full_text] : []),
      ...(needs.seo
        ? [edition.seo?.metaTitle, edition.seo?.metaDescription]
        : []),
    ];
    if (!texts.every(isFilled))
      return `بخش‌های لازم نسخهٔ ${language} را تکمیل کنید.`;
    if (base.key === "terms" && !hasBody(edition.html))
      return `متن کامل قوانین نسخهٔ ${language} را وارد کنید.`;
  }
  return null;
};

/** Sends only the parts the Persian original uses, so the Back accepts short entries. */
export const cleanContentTranslations = (
  translations: ContentTranslations,
  base: ContentTranslationBase,
) => {
  const needs = translationNeeds(base);
  return Object.fromEntries(
    LOCALES.filter((locale) => translations[locale]).map((locale) => {
      const edition = translations[locale]!;
      return [
        locale,
        {
          title: edition.title,
          ...(needs.small_text ? { small_text: edition.small_text } : {}),
          ...(needs.full_text ? { full_text: edition.full_text } : {}),
          ...(needs.html ? { html: edition.html } : {}),
          ...(needs.seo ? { seo: edition.seo } : {}),
        },
      ];
    }),
  );
};
