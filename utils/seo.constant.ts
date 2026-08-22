import { CreateProps } from "@/components/Table/table.type";

export const SEO_FORM_ITEMS: CreateProps[] = [
  { state: "metaTitle", title: "Meta Title", type: "input" },
  { state: "metaDescription", title: "Meta Description", type: "input" },
  { state: "canonicalURL", title: "Canonical URL", type: "input" },
  // { state: "url", title: "Url", type: "input" },
  { state: "", title: "", type: "divider" },
  { state: "", title: "Sitemap", type: "dividerTitle" },
  {
    state: "sitemap_url",
    title: "Sitemap Url",
    type: "input",
    options: { titleHint: "(Without slug)", hint: "Ex: blog" },
  },
  { state: "sitemap_priority", title: "Priority", type: "input", options: { keyboard: "number" } },
  {
    state: "sitemap_change_freq",
    title: "Change Freq",
    type: "select",
    selectItems: [
      { id: "never", title: "never" },
      { id: "always", title: "always" },
      { id: "hourly", title: "hourly" },
      { id: "daily", title: "daily" },
      { id: "weekly", title: "weekly" },
      { id: "monthly", title: "monthly" },
      { id: "yearly", title: "yearly" },
    ],
  },
  {
    state: "is_url_without_slug",
    title: "Is url without slug?",
    type: "select",
    options: { titleHint: "(default: No)" },
    selectItems: [
      { id: "1", title: "Yes" },
      { id: "0", title: "No" },
    ],
  },
];

export const CONTENT_CATEGORY_SEO_FORM_ITEMS = [SEO_FORM_ITEMS[0], SEO_FORM_ITEMS[1], SEO_FORM_ITEMS[2]];
