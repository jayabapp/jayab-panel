"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import pluralize from "pluralize";
import {
  ActionButton,
  Column,
  ColumnComponent,
  CreateProps,
  FilterProp,
  Operator,
  TableServerProps,
} from "@/components/Table/table.type";
import Loading from "@/components/shared/Loading";
import EditButton from "@/components/Table/Action/EditButton";
import Table from "@/components/Table";
import Cell from "@/components/Table/Cell";
import DeleteButton from "@/components/Table/Action/DeleteButton";
import ShowButton from "@/components/Table/Action/ShowButton";
import PageHeader from "@/components/Table/PageHeader";
import moment from "moment-jalaali";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import TableFilter from "@/components/Table/TableFilter";
import { Button, Pagination } from "@nextui-org/react";
import { PaginationMeta } from "@/interfaces/pagination.type";
import { apiRoutes } from "@/utils/urls";
import { isEmpty, kebabCase } from "lodash";
import createTableRowsHelper from "@/helpers/generator/CreateTableRow.helper";
import { produce } from "immer";
import SaveButton from "@/components/Table/Action/SaveButton";
import { useQueryGet } from "@/helpers/query-get.hooks";
import QueryString from "qs";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import GeneralModal from "@/components/Modal";

const endpoint = apiRoutes.PAGE_SEO_ANALYZE1;

const PageSeoAnalyzes = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queriesParams = useQueryGet<any>();

  const [deleteModalisVisible, setDeleteModalIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [tableProps, setTableProps] = useState<TableServerProps>();
  const [filterProps, setFilterProps] = useState<CreateProps[]>([]);

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams?.get("page")) || 1
  );
  const [meta, setMeta] = useState<PaginationMeta>();

  const [updatedStates, setUpdatedStates] = useState<any>({});
  const [editableColumns, setEditableColumns] = useState<Array<string>>([]);

  /* --------------------------------- Modals --------------------------------- */
  const [noAltImages, setNoAltImages] = useState([]);
  const [schemaModal, setSchemaModal] = useState(null);
  const [linksModal, setLinksModal] = useState([]);

  useEffect(() => {
    getModelProps();
  }, []);

  /* ------------------------------- PAGE QUERY ------------------------------- */
  useEffect(() => {
    getList(currentPage, queriesParams);
  }, [currentPage, queriesParams]);

  /* -------------------------------- GET MODEL PROPS ------------------------------- */
  const { model, modelTitle, columns, availableActions } = tableProps || {};
  const getModelProps = () => {
    ApiCall(
      "GET",
      `${endpoint}/model-props`,
      null,
      "GET MODEL PROPS",
      ({ data }) => {
        setTableProps(data.tableProps || {});
        setFilterProps(
          data.filterProps?.filter(
            (e: FilterProp) => e.isHidden == false || !e.isHidden
          )
        );

        const editableColumnsKey: string[] = [];
        data?.tableProps?.columns?.map((e: Column) => {
          if (e.isEditable) editableColumnsKey.push(e.update_key || e.key);
        });
        setEditableColumns(editableColumnsKey);
      }
    );
  };

  /* -------------------------------- GET LIST -------------------------------- */
  const getList = (page: number, filterQuery: object) => {
    let body = queriesParams;
    if (filterQuery) body = { ...body, ...filterQuery };
    body = { ...body, page: currentPage || page };

    console.log({ body });

    ApiCall("GET", endpoint, body, "GET LIST", ({ data }) => {
      setList(data.data);
      setMeta(data.meta);
      router.replace(`${pathname}?${QueryString.stringify(body)}`);
      setIsLoading(false);
    });
  };

  /* -------------------------------- DELETE  A COLOR ------------------------------- */
  const onDelete = () => {
    setIsLoading(true);
    ApiCall(
      "DELETE",
      `${endpoint}/${selectedItemId}`,
      null,
      `DELETE A ${model?.toUpperCase()} `,
      ({ data }) => {
        getList(currentPage, queriesParams);
        setDeleteModalIsVisible(false);
      }
    );
  };
  if (isLoading) {
    return <Loading />;
  }

  /* ---------------------------- CREATE TABLE ROWS --------------------------- */
  const createTableRows = (rowData: any) => {
    const items = createTableRowsHelper(
      rowData,
      columns,
      updatedStates,
      setUpdatedStates
    );
    return items;
  };

  /* ------------------- SUBMIT FUNCTION FOR EDITABLE COLUMNS ------------------ */
  const onUpdate = (pageId: any) => {
    setDisabled(true);

    ApiCall(
      "GET",
      `${endpoint}/scrape?pageId=${pageId}`,
      null,
      "Update",
      ({ data }) => {
        getList(currentPage, queriesParams);

        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  /**
   * این سرویس همه ایتم رو مجدد در صف بررسی قرار میده
   * @param pageId
   */
  const onUpdateAll = () => {
    setDisabled(true);
    ApiCall(
      "GET",
      `${endpoint}/scrape/all`,
      null,
      "Update All",
      ({ data }) => {
        getList(1, {});
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  const onSyncSitemap = () => {
    setDisabled(true);
    ApiCall(
      "GET",
      `${endpoint}/sync-sitemap`,
      null,
      "Sync Sitemap",
      ({ data }) => {
        getList(1, {});
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  /* -------------------------- CREATE ACTION BUTTONS ------------------------- */
  const createTableActions = (row: any) => {
    const items: ActionButton[] = [];
    let uniqueActions: string[] = [];

    availableActions?.map((e) => {
      if (!uniqueActions.includes(e)) uniqueActions.push(e);
    });
    for (const action of uniqueActions) {
      switch (action) {
        case "show":
          items.push({
            id: 1,
            component: (
              <ShowButton
                onPress={() =>
                  router.push(
                    `/${pluralize(kebabCase(model) || "")}/show/${row.id}`
                  )
                }
              />
            ),
          });
          break;

        default:
          break;
      }
    }
    items.push({
      id: 4,
      component: (
        <Button
          color="warning"
          variant="solid"
          size="sm"
          className="w-24"
          disabled={disabled}
          isLoading={disabled}
          onPress={() => onUpdate(row.id)}
        >
          به روز رسانی
        </Button>
      ),
    });

    items.push({
      id: 4,
      component: (
        <Button
          color="secondary"
          variant="solid"
          size="sm"
          className="w-24"
          disabled={isEmpty(row.no_alt_images)}
          onPress={() => setNoAltImages(row.no_alt_images || [])}
        >
          تصاویر
        </Button>
      ),
    });

    const internalLinks = row.links?.filter((e: any) => e.is_internal);
    items.push({
      id: 14,
      component: (
        <Button
          color="primary"
          variant="solid"
          size="sm"
          className="w-24"
          disabled={isEmpty(internalLinks)}
          onPress={() => setLinksModal(internalLinks || [])}
        >
          لینک های داخلی
        </Button>
      ),
    });

    const externalLinks = row.links?.filter((e: any) => !e.is_internal);
    items.push({
      id: 14,
      component: (
        <Button
          color="primary"
          variant="solid"
          size="sm"
          className="w-24"
          disabled={isEmpty(externalLinks)}
          onPress={() => setLinksModal(externalLinks || [])}
        >
          لینک های خارجی
        </Button>
      ),
    });

    row.schemas?.map((schema: any) => {
      items.push({
        id: schema["@type"],
        component: (
          <Button
            color="default"
            variant="solid"
            size="sm"
            className="w-24"
            onPress={() => setSchemaModal(schema)}
          >
            <p className="text-[10px]">{`${schema["@type"].toLowerCase()}`}</p>
          </Button>
        ),
      });
    });
    return items;
  };

  if (isLoading || !tableProps) return <Loading />;
  return (
    <div className="">
      {/*********************** PAGE HEADER ************************/}
      <PageHeader
        model={model}
        modelTitle={modelTitle}
        hasCreateButton={tableProps.availableActions?.includes("create")}
        totalCount={meta?.total}
        title="آنالیز صفحات"
      >
        <Button color="danger" onClick={onUpdateAll}>
          بررسی مجدد همه
        </Button>
        <Button color="warning" onClick={onSyncSitemap}>
          سینک مجدد سایت مپ
        </Button>
      </PageHeader>

      {/*********************** FILTER ************************/}
      <TableFilter
        filterProps={filterProps}
        onSubmitFilter={(filters: object) => {
          getList(1, filters);
          setCurrentPage(1);
        }}
      />

      {/*********************** TABLE ************************/}
      <div className="app-container-profile">
        <Table
          data={list}
          columns={columns || []}
          rows={list?.map((row: any) => ({
            id: row.id,
            items: createTableRows(row),
            actions: createTableActions(row),
          }))}
        />
      </div>

      {/*********************** PAGINATION  ************************/}
      <div className="direction-ltr fixed bottom-4 left-2">
        <Pagination
          total={meta?.lastPage || 1}
          initialPage={1}
          page={currentPage}
          onChange={setCurrentPage}
          color="primary"
          showShadow={true}
          classNames={{
            item: "bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-800",
            next: "bg-gray-100 dark:bg-slate-800 dark:hover:bg-teal-700",
            prev: "bg-gray-100 dark:bg-slate-800 dark:hover:bg-teal-700",
          }}
          className="mt-6"
          dotsJump={3}
          showControls
        />
      </div>
      {/*no alt image*/}
      <GeneralModal
        isVisible={!isEmpty(noAltImages)}
        isLoading={disabled}
        onHide={() => setNoAltImages([])}
        onConfirm={() => {}}
      >
        <div className="grid grid-cols-2 lg:grid-cols-6 2xl:grid-cols-8 gap-1 mx-auto ">
          {noAltImages?.map((e: string, i: number) => (
            <img
              key={i}
              src={
                e.startsWith("/")
                  ? `${process.env.NEXT_PUBLIC_WEBSITE_URL}${e}`
                  : e
              }
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </GeneralModal>

      {/*schema*/}
      <GeneralModal
        isVisible={!!schemaModal}
        isLoading={disabled}
        onHide={() => setSchemaModal(null)}
        onConfirm={() => {}}
      >
        <div className="ltr mx-auto whitespace-pre-line overflow-x-scroll">
          <pre>{JSON.stringify(schemaModal, null, 2)}</pre>
        </div>
      </GeneralModal>

      {/*links*/}
      <GeneralModal
        isVisible={!isEmpty(linksModal)}
        isLoading={disabled}
        onHide={() => setLinksModal([])}
        onConfirm={() => {}}
      >
        <div className="ltr">
          <table className="w-full border-collapse  overflow-scroll table">
            <thead className={`bg-slate-50 dark:bg-slate-700 overflow-scroll`}>
              <tr>
                <th className="p-2 font-bold text-lg">url</th>
                <th className="p-2 font-bold text-lg">rel</th>
              </tr>
            </thead>
            <tbody>
              {linksModal?.map((e: any, i: number) => (
                <tr
                  key={i}
                  className="odd:bg-neutral-100 odd:dark:bg-slate-800 even:bg-neutral-50 even:dark:bg-slate-700"
                >
                  <td className="py-3 px-2 border-r border-slate-600">
                    <a
                      className="text-primary-600 underline underline-offset-4"
                      href={e.href}
                      target="_blank"
                    >
                      {e.href}
                    </a>
                  </td>
                  <td>{e.rel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GeneralModal>
    </div>
  );
};

export default PageSeoAnalyzes;
