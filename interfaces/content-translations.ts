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

/** The Persian original a translation is checked against. */
export type ContentTranslationBase = {
  key?: string | null;
  html?: string | null;
  full_text?: string | null;
  small_text?: string | null;
  seo?: { metaTitle?: string; metaDescription?: string } | null;
};
