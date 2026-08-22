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
import { kebabCase } from "lodash";
import createTableRowsHelper from "@/helpers/generator/CreateTableRow.helper";
import { produce } from "immer";
import SaveButton from "@/components/Table/Action/SaveButton";
import { useQueryGet } from "@/helpers/query-get.hooks";
import QueryString from "qs";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const endpoint = apiRoutes.CONTACT_US1;

const ContactUs = ({}) => {
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

  const [currentPage, setCurrentPage] = useState(Number(searchParams?.get("page")) || 1);
  const [meta, setMeta] = useState<PaginationMeta>();

  const [updatedStates, setUpdatedStates] = useState<any>({});
  const [editableColumns, setEditableColumns] = useState<Array<string>>([]);

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
    ApiCall("GET", `${endpoint}/model-props`, null, "GET MODEL PROPS", ({ data }) => {
      setTableProps(data.tableProps || {});
      setFilterProps(data.filterProps?.filter((e: FilterProp) => e.isHidden == false || !e.isHidden));

      const editableColumnsKey: string[] = [];
      data?.tableProps?.columns?.map((e: Column) => {
        if (e.isEditable) editableColumnsKey.push(e.update_key || e.key);
      });
      setEditableColumns(editableColumnsKey);
    });
  };

  /* -------------------------------- GET LIST -------------------------------- */
  const getList = (page: number, filterQuery: object) => {
    let body = queriesParams;
    if (filterQuery) body = { ...body, ...filterQuery };
    body = { ...body, page: page || currentPage };

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
    ApiCall("DELETE", `${endpoint}/${selectedItemId}`, null, `DELETE A ${model?.toUpperCase()} `, ({ data }) => {
      getList(currentPage, queriesParams);
      setDeleteModalIsVisible(false);
    });
  };
  if (isLoading) {
    return <Loading />;
  }

  /* ---------------------------- CREATE TABLE ROWS --------------------------- */
  const createTableRows = (rowData: any) => {
    const items = createTableRowsHelper(rowData, columns, updatedStates, setUpdatedStates);
    return items;
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
            component: <ShowButton onPress={() => router.push(`/${kebabCase(model) || ""}/show/${row.id}`)} />,
          });
          break;

        case "edit":
          items.push({
            id: 2,
            component: (
              <EditButton onPress={() => router.push(`/${pluralize(kebabCase(model) || "")}/edit/${row.id}`)} />
            ),
          });
          break;

        case "delete":
          items.push({
            id: 3,
            component: (
              <DeleteButton
                onPress={() => {
                  setSelectedItemId(row.id);
                  setDeleteModalIsVisible(true);
                }}
              />
            ),
          });
          break;

        case "submit": //For editing in table
          items.push({
            id: 4,
            component: (
              <SaveButton
                isChanged={!!updatedStates[row.id]}
                disabled={disabled}
                onPress={() => onSubmitEditedRow(row)}
              />
            ),
          });
          break;

        default:
          break;
      }
    }
    return items;
  };

  /* ------------------- SUBMIT FUNCTION FOR EDITABLE COLUMNS ------------------ */
  const onSubmitEditedRow = (row: any) => {
    const rowId: number = row.id;
    setDisabled(true);
    let body: any = {};
    editableColumns.map((key) => {
      body[key] = updatedStates[rowId]?.[key]?.id || updatedStates[rowId]?.[key] || row[key];
    });

    ApiCall(
      "PATCH",
      `${endpoint}/${rowId}/update-partial`,
      body,
      "SUBMIT EDIT",
      ({ data }) => {
        getList(currentPage, {});
        setUpdatedStates(
          produce((draft: any) => {
            delete draft[rowId];
          })
        );
        setDisabled(false);
      },
      () => setDisabled(false)
    );
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
      />

      {/*********************** FILTER ************************/}
      {/* <TableFilter
        filterProps={filterProps}
        onSubmitFilter={(filters: object) => {
          getList(1, filters);
          setCurrentPage(1);
        }}
      /> */}

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
      {/*********************** DELETE MODAL  ************************/}
      <ConfirmModal
        text={"آیا میخواهید این آیتم را حذف کنید؟"}
        isVisible={deleteModalisVisible}
        isLoading={disabled}
        onHide={() => setDeleteModalIsVisible(false)}
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
};

export default ContactUs;
