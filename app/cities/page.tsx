"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { apiRoutes } from "@/utils/urls";
import { Button, Modal, ModalContent, Switch } from "@nextui-org/react";
import { FolderMinusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import FormInput from "@/components/Form/FormInput";
import { Divider } from "@/components/shared/Divider";
import { p2e } from "@/helpers/p2e";
import CityTreeNode, {
  isTranslated,
  type CityNode,
  type CityTreeActions,
} from "@/components/Cities/CityTreeNode";

import type { TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

const endpoint = `${apiRoutes.CITIES1}/cascade`;

// Opened provinces survive a visit to the edit page (sessionStorage is per tab).
const EXPANDED_KEY = "cities-expanded";

const readExpanded = () => {
  try {
    return new Set<number>(
      JSON.parse(sessionStorage.getItem(EXPANDED_KEY) || "[]"),
    );
  } catch {
    return new Set<number>();
  }
};

const collectIds = (nodes: CityNode[]): number[] =>
  nodes.flatMap((node) => [node.id, ...collectIds(node.child ?? [])]);

const countTranslated = (nodes: CityNode[]): { total: number; done: number } =>
  nodes.reduce(
    (sum, node) => {
      const inner = countTranslated(node.child ?? []);
      return {
        total: sum.total + 1 + inner.total,
        done: sum.done + (isTranslated(node) ? 1 : 0) + inner.done,
      };
    },
    { total: 0, done: 0 },
  );

/** Returns the same array when nothing changed, so untouched rows keep their identity. */
const patchTranslations = (
  nodes: CityNode[],
  id: number,
  translations: TitleTranslations,
): CityNode[] => {
  let changed = false;
  const next = nodes.map((node) => {
    if (node.id === id) {
      changed = true;
      return { ...node, translations };
    }
    if (!node.child) return node;
    const child = patchTranslations(node.child, id, translations);
    if (child === node.child) return node;
    changed = true;
    return { ...node, child };
  });
  return changed ? next : nodes;
};

/**
 * A row is shown when it matches the filters, or when one of its descendants does.
 * Children of a row that matches the search text are shown too. `open` lists the rows
 * that have a visible child, so the matches are reachable without clicking.
 */
const computeVisibility = (
  nodes: CityNode[],
  text: string,
  onlyUntranslated: boolean,
) => {
  const visible = new Set<number>();
  const open = new Set<number>();

  const walk = (node: CityNode, ancestorMatched: boolean): boolean => {
    const textMatched =
      ancestorMatched ||
      !text ||
      [node.title, node.translations?.en?.title, node.translations?.ar?.title]
        .filter(Boolean)
        .some((title) => title!.toLowerCase().includes(text));

    let childVisible = false;
    for (const child of node.child ?? []) {
      if (walk(child, textMatched)) childVisible = true;
    }

    const selfVisible =
      textMatched && (!onlyUntranslated || !isTranslated(node));
    if (childVisible) open.add(node.id);
    if (selfVisible || childVisible) visible.add(node.id);
    return selfVisible || childVisible;
  };

  nodes.forEach((node) => walk(node, false));
  return { visible, open };
};

const Cities = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<CityNode[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<any>();
  const [newCityTitle, setNewCityTitle] = useState<string>("");
  const [newCitySort, setNewCitySort] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(readExpanded);
  const [translateMode, setTranslateMode] = useState(false);
  const [query, setQuery] = useState("");
  const [onlyUntranslated, setOnlyUntranslated] = useState(false);
  const dirtyRef = useRef(new Set<number>());
  const listRef = useRef(list);
  listRef.current = list;

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(EXPANDED_KEY, JSON.stringify(Array.from(expanded)));
    } catch {}
  }, [expanded]);

  // Warns before the tab is closed or reloaded with translations typed but not saved.
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current.size) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  /* -------------------------------- FILTER -------------------------------- */
  // Recomputed only when the filter changes, not after each save: a row saved while
  // "only untranslated" is on stays in place instead of vanishing under the cursor.
  const filter = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (isLoading || (!text && !onlyUntranslated)) return null;
    return computeVisibility(listRef.current, text, onlyUntranslated);
  }, [query, onlyUntranslated, isLoading]);

  useEffect(() => {
    if (filter) setExpanded(new Set(filter.open));
  }, [filter]);

  const progress = useMemo(() => countTranslated(list), [list]);

  /* -------------------------------- GET LIST -------------------------------- */
  const getList = () => {
    ApiCall(
      "GET",
      `${endpoint}`,
      null,
      "GET LIST",
      ({ data }: { data: CityNode[] }) => {
        setList(data);
        setIsLoading(false);
      },
    );
  };

  const onDelete = () => {
    setDisabled(true);
    ApiCall(
      "DELETE",
      `${apiRoutes.CITIES1}/${selectedItemId}`,
      null,
      "DELETE",
      () => {
        getList();
        setDisabled(false);
        setSelectedItemId(null);
      },
      () => setDisabled(false),
    );
  };

  const onSubmit = () => {
    setDisabled(true);

    const body = {
      title: newCityTitle,
      parent_id: selectedParent?.id,
      sort_order: +p2e(newCitySort) || null,
    };

    ApiCall(
      "POST",
      apiRoutes.CITIES1,
      body,
      "SUBMIT CITY",
      () => {
        getList();
        setSelectedParent(null);
        setVisibleEditModal(false);
        setNewCityTitle("");
        setNewCitySort("");
        setDisabled(false);
      },
      () => {
        setDisabled(false);
      },
    );
  };

  const actions = useMemo<CityTreeActions>(
    () => ({
      onToggle: (id) =>
        setExpanded((prev) => {
          const next = new Set(prev);
          if (!next.delete(id)) next.add(id);
          return next;
        }),
      onEdit: (id) => router.push(`/cities/${id}/edit`),
      onDelete: setSelectedItemId,
      onAddChild: (node) => {
        setSelectedParent(node);
        setVisibleEditModal(true);
      },
      onSaved: (id, translations) =>
        setList((prev) => patchTranslations(prev, id, translations)),
      onDirtyChange: (id, dirty) => {
        if (dirty) dirtyRef.current.add(id);
        else dirtyRef.current.delete(id);
      },
    }),
    [router],
  );

  if (isLoading) return <Loading />;
  return (
    <div className="">
      {/*********************** PAGE HEADER ************************/}
      <PageHeader
        model="کشورها"
        createRoute={`/cities/${undefined}/create`}
        modelTitle="استان"
        hasCreateButton={true}
      >
        <Button
          color="success"
          variant="light"
          startContent={<FolderPlusIcon className="w-5" />}
          onPress={() => setExpanded(new Set(collectIds(list)))}
        >
          باز کردن همه
        </Button>
        <Button
          color="danger"
          variant="light"
          startContent={<FolderMinusIcon className="w-5" />}
          onPress={() => setExpanded(new Set())}
        >
          بستن همه
        </Button>
      </PageHeader>

      {/*********************** TRANSLATION TOOLS ************************/}
      <div className="my-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Switch
          size="sm"
          isSelected={translateMode}
          onValueChange={setTranslateMode}
        >
          حالت ترجمه
        </Switch>
        <input
          type="search"
          value={query}
          placeholder="جستجو در نام فارسی، انگلیسی و عربی"
          aria-label="جستجو"
          className="w-72 max-w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-1.5 text-sm"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Switch
          size="sm"
          isSelected={onlyUntranslated}
          onValueChange={setOnlyUntranslated}
        >
          فقط ترجمه‌نشده‌ها
        </Switch>
        <span className="text-sm opacity-80">
          {progress.done.toLocaleString("fa-IR")} از{" "}
          {progress.total.toLocaleString("fa-IR")} مورد، هم انگلیسی و هم عربی
          دارند
        </span>
      </div>

      {/*********************** TREE ************************/}
      <div className="">
        {filter && filter.visible.size === 0 && (
          <p className="py-6 text-center text-sm opacity-70">موردی پیدا نشد.</p>
        )}
        {list.map((node) => (
          <CityTreeNode
            key={node.id}
            node={node}
            depth={0}
            translateMode={translateMode}
            expanded={expanded}
            visible={filter ? filter.visible : null}
            actions={actions}
          />
        ))}
      </div>

      {/*********************** DELETE MODAL  ************************/}
      <ConfirmModal
        text={"آیا میخواهید این آیتم را حذف کنید؟"}
        isVisible={!!selectedItemId}
        isLoading={disabled}
        onHide={() => setSelectedItemId(null)}
        onConfirm={() => {
          onDelete();
        }}
      />

      <Modal
        isOpen={visibleEditModal}
        onClose={() => setVisibleEditModal(false)}
      >
        <ModalContent className="app-background px-4 py-8">
          <div className="app-text mx-4 mt-6">
            <div className="">
              <FormInput
                title={
                  !selectedParent?.parent_id ? "نام شهر" : "نام محله یا منطقه"
                }
                options={{
                  containerClass: "w-full",
                  placeholder: "تهران",
                  maxLength: 50,
                  keyboard: "text",
                }}
                onChangeText={setNewCityTitle}
                value={newCityTitle}
                showX={false}
              />
              <FormInput
                title="ترتیب نمایش"
                options={{
                  containerClass: "w-full",
                  placeholder: "مثلا: 1",
                  keyboard: "number",
                }}
                onChangeText={setNewCitySort}
                value={newCitySort}
                showX={false}
              />
            </div>
            <div className="sticky bottom-0 left-0 right-0 flex flex-col jusstify-between itemss-center w-full pt-2 pb-4">
              <Divider moreClass="opacity-0 mt-1" />
              <Button
                color="primary"
                disabled={disabled}
                isLoading={disabled}
                onPress={() => {
                  onSubmit();
                }}
              >
                ثبت
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Cities;
