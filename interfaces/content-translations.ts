export type ContentTranslation = {
  html: string;
  title: string;
  full_text: string;
  small_text: string;
  seo: { metaTitle: string; metaDescription: string };
};

export type ContentTranslations = Partial<
  Record<"ar" | "en", ContentTranslation>
>;
