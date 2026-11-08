"use client";

import { memo, useEffect, useState } from "react";
import { Button, Chip } from "@nextui-org/react";
import { CheckCircleIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { prepareTitleTranslations } from "@/components/Content/TitleTranslationsEditor";
import { apiRoutes, IMAGE_URL } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";

import type { TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

export type CityNode = {
  id: number;
  title: string;
  parent_id?: number | null;
  image?: any;
  translations?: TitleTranslations | null;
  child?: CityNode[];
};

/** Stable callbacks from the page, passed as one prop so memoized rows skip re-rendering. */
export type CityTreeActions = {
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddChild: (node: CityNode) => void;
  onSaved: (id: number, translations: TitleTranslations) => void;
  onDirtyChange: (id: number, dirty: boolean) => void;
};

type Props = {
  node: CityNode;
  depth: number;
  translateMode: boolean;
  expanded: Set<number>;
  /** `null` = no filter. Rows outside the set are hidden, not unmounted, so unsaved text survives. */
  visible: Set<number> | null;
  actions: CityTreeActions;
};

type Status = "idle" | "saving" | "saved" | "error";

const savedTitle = (node: CityNode, locale: "en" | "ar") =>
  node.translations?.[locale]?.title ?? "";

export const isTranslated = (node: CityNode) =>
  !!savedTitle(node, "en") && !!savedTitle(node, "ar");

const INPUT =
  "w-40 rounded-lg border border-neutral-300 bg-transparent px-2 py-1 text-sm disabled:opacity-60";

const CityTreeNode = memo(function CityTreeNode({
  node,
  depth,
  translateMode,
  expanded,
  visible,
  actions,
}: Props) {
  const children = node.child ?? [];
  const isOpen = expanded.has(node.id);
  // Children mount the first time the row opens and then stay mounted (hidden when
  // closed), so a draft typed in a child is not lost when its parent is collapsed.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen && !wasOpen) setWasOpen(true);

  const [draft, setDraft] = useState({
    en: savedTitle(node, "en"),
    ar: savedTitle(node, "ar"),
  });
  const [status, setStatus] = useState<Status>("idle");

  const dirty =
    draft.en.trim() !== savedTitle(node, "en") ||
    draft.ar.trim() !== savedTitle(node, "ar");
  const { onDirtyChange } = actions;
  useEffect(() => {
    onDirtyChange(node.id, dirty);
    return () => onDirtyChange(node.id, false);
  }, [dirty, node.id, onDirtyChange]);

  const change = (locale: "en" | "ar", value: string) => {
    setDraft((prev) => ({ ...prev, [locale]: value }));
    setStatus("idle");
  };

  // The whole translations object is replaced by the API, so both languages go together.
  const save = () => {
    if (!dirty || status === "saving") return;
    const translations = prepareTitleTranslations({
      en: { title: draft.en },
      ar: { title: draft.ar },
    });
    setStatus("saving");
    ApiCall(
      "PUT",
      `${apiRoutes.CITIES1}/${node.id}`,
      { translations },
      "SAVE CITY TRANSLATION",
      () => {
        setStatus("saved");
        actions.onSaved(node.id, translations);
      },
      () => setStatus("error"),
    );
  };

  const hiddenByFilter = visible !== null && !visible.has(node.id);
  const type = !node.parent_id ? "استان" : depth === 1 ? "شهر" : "محله";
  const saving = status === "saving";

  return (
    <div
      className={
        hiddenByFilter
          ? "hidden"
          : depth === 0
            ? "bg-gray-200 dark:bg-slate-900 border border-neutral-300 dark:border-slate-800 mt-2 py-2 px-3 rounded-xl"
            : ""
      }
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-1.5">
        <button
          type="button"
          aria-expanded={children.length ? isOpen : undefined}
          onClick={() => children.length && actions.onToggle(node.id)}
          className="flex w-52 shrink-0 items-center gap-2 text-right"
        >
          <ChevronLeftIcon
            className={`w-3 shrink-0 transition-transform ${
              !children.length ? "opacity-20" : isOpen ? "-rotate-90" : ""
            }`}
          />
          {node.image && (
            <img
              className="w-10 h-10 rounded-10"
              src={IMAGE_URL(node.image)}
              alt=""
            />
          )}
          <span className="text-sm app-text font-bold">{node.title}</span>
        </button>

        {/* Fixed width so the inputs line up whether or not the tag shows. */}
        <div className="flex w-28 shrink-0 items-center gap-2">
          <span className="text-sm font-light">{type}</span>
          {!isTranslated(node) && (
            <Chip size="sm" color="warning" variant="flat">
              ناقص
            </Chip>
          )}
        </div>

        {translateMode && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              dir="ltr"
              lang="en"
              type="text"
              maxLength={200}
              placeholder="English"
              aria-label={`${node.title} — English`}
              value={draft.en}
              disabled={saving}
              className={INPUT}
              onChange={(event) => change("en", event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && save()}
            />
            <input
              dir="rtl"
              lang="ar"
              type="text"
              maxLength={200}
              placeholder="العربية"
              aria-label={`${node.title} — العربية`}
              value={draft.ar}
              disabled={saving}
              className={INPUT}
              onChange={(event) => change("ar", event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && save()}
            />
            <Button
              size="sm"
              color="primary"
              isLoading={saving}
              isDisabled={!dirty}
              onPress={save}
            >
              ثبت
            </Button>
            {status === "saved" && !dirty && (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircleIcon className="w-4" />
                ثبت شد
              </span>
            )}
            {status === "error" && (
              <span className="text-sm text-danger">خطا؛ دوباره ثبت کنید</span>
            )}
            {dirty && status !== "saving" && status !== "error" && (
              <span className="text-sm opacity-70">ثبت‌نشده</span>
            )}
          </div>
        )}

        <div className="flex gap-2 mr-auto">
          <Button
            size="sm"
            color="secondary"
            variant="flat"
            onPress={() => actions.onEdit(node.id)}
          >
            ویرایش
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => actions.onDelete(node.id)}
          >
            حذف
          </Button>
          {depth < 2 && (
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() => actions.onAddChild(node)}
            >
              {!node.parent_id ? "افزودن شهـر" : "افزودن محله"}
            </Button>
          )}
        </div>
      </div>

      {wasOpen && children.length > 0 && (
        <div
          className={`${
            isOpen ? "" : "hidden"
          } ms-4 ps-3 border-s border-dashed border-gray-300 dark:border-slate-600`}
        >
          {children.map((child) => (
            <CityTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              translateMode={translateMode}
              expanded={expanded}
              visible={visible}
              actions={actions}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default CityTreeNode;
