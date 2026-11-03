export type TranslationLocale = "en" | "ar";

export type TranslationEditions = Partial<
  Record<TranslationLocale, Record<string, string | null | undefined>>
>;

export type PropertyTranslationSection = "main" | "descriptions" | "host";

/** Shape of GET /properties/:id/translations. */
export type PropertyTranslationsData = {
  id: number;
  code: string;
  main: {
    fa: { title?: string | null; address?: string | null };
    translations: TranslationEditions | null;
  };
  descriptions: {
    fa: Record<string, string>;
    translations: TranslationEditions | null;
  };
  host: { fa: string; translations: TranslationEditions | null };
};

export type PropertyTranslationsForm = Record<
  PropertyTranslationSection,
  TranslationEditions
>;
