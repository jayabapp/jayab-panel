"use client";

import Notify from "@/components/shared/Toast";

/** Copies one box's text in a single tap, so translators can paste it straight into an AI tool. */
const CopyButton = ({ text }: { text: string }) => (
  <button
    type="button"
    disabled={!text}
    onClick={() =>
      navigator.clipboard
        .writeText(text)
        .then(() => Notify({ type: "success", body: "متن کپی شد" }))
        .catch(() => Notify({ type: "error", body: "کپی انجام نشد" }))
    }
    className="shrink-0 rounded-md border px-3 py-1 text-sm hover:bg-black/5 disabled:opacity-40 dark:hover:bg-white/10"
  >
    کپی
  </button>
);

export default CopyButton;
