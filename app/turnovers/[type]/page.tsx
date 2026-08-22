"use client";

import { useState, useEffect, useRef } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
// import ConfirmModal from "../../components/shared/Modal/ConfirmModal";
import {
  ActionButton,
  Column,
  ColumnComponent,
  FilterProp,
  Operator,
  TableServerProps,
} from "@/components/Table/table.type";
import Loading from "@/components/shared/Loading";
import Table from "@/components/Table";
import Cell from "@/components/Table/Cell";
import PageHeader from "@/components/Table/PageHeader";
import moment from "moment-jalaali";
import { Button, Pagination } from "@nextui-org/react";
import { PaginationMeta } from "@/interfaces/pagination.type";
import { apiRoutes } from "@/utils/urls";

const endpoint = apiRoutes.TURNOVER1;

const Turnovers = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const [deleteModalisVisible, setDeleteModalIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [tableProps, setTableProps] = useState<TableServerProps>();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filterProps, setFilterProps] = useState<FilterProp[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>(
    searchParams?.get("filters") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams?.get("page")) || 1
  );
  const firstRender = useRef(true);
  const [meta, setMeta] = useState<PaginationMeta>();

  useEffect(() => {
    getModelProps();
  }, []);

  /* ------------------------------ FILTER QUERY ------------------------------ */
  useEffect(() => {
    getList(currentPage);
    router.replace(`${pathname}?page=${currentPage}&filters=${filterQuery}`);
  }, [filterQuery]);

  /* ------------------------------- PAGE QUERY ------------------------------- */
  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else {
      getList(currentPage);
      router.replace(`${pathname}?page=${currentPage}&filters=${filterQuery}`);
    }
  }, [currentPage]);

  /* -------------------------------- GET MODEL PROPS ------------------------------- */
  const { model, modelTitle, columns, availableActions } = tableProps || {};
  const getModelProps = () => {
    ApiCall(
      "GET",
      `${endpoint}/model-props?type=${params?.type}`,
      null,
      "GET MODEL PROPS",
      ({ data }) => {
        setTableProps(data.tableProps || {});
        setFilterProps(data.filterProps);
        setOperators(data.operators);
      }
    );
  };

  /* -------------------------------- GET LIST -------------------------------- */
  const getList = (page: number, perPage?: number) => {
    let address = `${endpoint}?page=${page || currentPage}`;
    if (filterQuery) address += `&${filterQuery}`;

    ApiCall("GET", address, null, "GET LIST", ({ data }) => {
      setList(data.data);
      setMeta(data.meta);
      setIsLoading(false);
    });
  };

  /* ---------------------------- CREATE TABLE ROWS --------------------------- */
  const createTableRows = (rowData: any) => {
    let items: ColumnComponent[] = [];
    for (const col of columns || []) {
      if (col.key == "id") continue;
      items.push({
        id: col.id,
        component: () => (
          <Cell
            value={findTableCellValue(rowData, col)}
            cellType={col.cellType}
          />
        ),
      });
    }
    return items;
  };

  const findTableCellValue = (rowData: any, col: Column) => {
    switch (col.cellType) {
      case "object":
        return col.nestedKey
          ? rowData[col.key]?.[col.nestedKey]
          : "Please define nestedKey";
      case "date":
        return moment(rowData[col.key]).format("jYYYY/jMM/jDD");
      case "enum":
        const v = col.enumList?.find((e) => e.id == rowData[col.key]);
        return v;
      default:
        return rowData[col.key] || "";
    }
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
        default:
          break;
      }
    }

    items.push({
      id: 1,
      component: (
        <Button
          color="warning"
          onPress={() => {
            router.push(
              `/${row.turnoverable_type}s/show/${row.turnoverable_id}`
            );
          }}
          isDisabled={row.turnoverable_id ? false : true}
        >
          جــزییـات سفارش
        </Button>
      ),
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
      <div className="direction-ltr fixed  bottom-4 left-0 lg:relative">
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
    </div>
  );
};

export default Turnovers;
