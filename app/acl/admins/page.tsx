"use client";
import { useState, useEffect } from "react";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { LinkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";
import Table from "@/components/Table";
import Cell from "@/components/Table/Cell";
import { ActionButton, AvailableAction, Column, ColumnComponent } from "@/components/Table/table.type";
import moment from "moment-jalaali";
import ShowButton from "@/components/Table/Action/ShowButton";
import pluralize from "pluralize";
import EditButton from "@/components/Table/Action/EditButton";
import DeleteButton from "@/components/Table/Action/DeleteButton";

const columns: Column[] = [
  { id: 2, title: "نام و نام خانوادگی", key: "full_name", cellType: "string" },
  { id: 3, title: "نام کاربری", key: "username", cellType: "string" },
  { id: 4, title: "موبایل", key: "mobile_number", cellType: "string" },
  { id: 41, title: "نقش", key: "role", cellType: "object", nestedKey: "name" },
  { id: 5, title: "تاریخ ایجاد", key: "created_at", cellType: "date" },
  { id: 6, title: "تاریخ به روزرسانی", key: "updated_at", cellType: "date" },
];
const availableActions: AvailableAction[] = ["show", "edit"];

const AdminsListPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    getAdmins();
  }, []);

  /* -------------------------------- GET ADMINS ------------------------------- */
  const getAdmins = () => {
    setIsLoading(true);
    ApiCall("GET", apiRoutes.ADMINS, null, "GET ADMINS", ({ data }) => {
      setAdmins(data);
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
        component: () => <Cell value={findTableCellValue(rowData, col)} cellType={col.cellType} />,
      });
    }
    return items;
  };

  const findTableCellValue = (rowData: any, col: Column) => {
    switch (col.cellType) {
      case "object":
        return col.nestedKey ? rowData[col.key]?.[col.nestedKey] : "Please define nestedKey";
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
        case "edit":
          items.push({
            id: 2,
            component: <EditButton onPress={() => router.push(`/acl/admins/edit/${row.id}`)} />,
          });
          break;

        default:
          break;
      }
    }
    return items;
  };

  return (
    <div className="app-container-profile ">
      {/*********************** PAGE HEADER ************************/}
      <div>
        <PageHeader title="مدیران" modelTitle="مدیر" createRoute="/acl/admins/create" />
      </div>
      {/*********************** TABLE ************************/}
      <div className="my-8">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Table
              data={admins}
              columns={columns || []}
              rows={admins?.map((row: any) => ({
                id: row.id,
                items: createTableRows(row),
                actions: createTableActions(row),
              }))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminsListPage;
