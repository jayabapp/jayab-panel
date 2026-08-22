"use client";
import { useState, useEffect } from "react";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";
import Table from "@/components/Table";
import EditButton from "@/components/Table/Action/EditButton";
import Cell from "@/components/Table/Cell";
import { Column, AvailableAction, ColumnComponent, ActionButton } from "@/components/Table/table.type";
import moment from "moment-jalaali";
import { Button } from "@nextui-org/react";

const columns: Column[] = [
  { id: 2, title: "نام", cellType: "string", key: "name" },
  { id: 3, title: "تاریخ ایجاد", cellType: "date", key: "created_at" },
];
const availableActions: AvailableAction[] = ["edit"];

const RolesListPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [aclRoles, setAclRoles] = useState([]);

  useEffect(() => {
    getAclRoles();
  }, []);

  /* -------------------------------- GET COUNTRIES ------------------------------- */
  const getAclRoles = () => {
    setIsLoading(true);
    ApiCall("GET", apiRoutes.ACL_ROLES, null, "GET ACL ROLES", ({ data }) => {
      setAclRoles(data);
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
            component: <EditButton onPress={() => router.push(`/acl/roles/edit/${row.id}`)} />,
          });
          break;

        default:
          break;
      }
    }
    items.push({
      id: 3,
      component: (
        <Button
          color="secondary"
          variant="flat"
          className="w-24"
          size="sm"
          onPress={() => router.push(`/acl/roles/permissions/${row.id}`)}
        >
          دسترسی ها
        </Button>
      ),
    });

    items.push({
      id: 4,
      component: (
        <Button
          color="primary"
          variant="flat"
          className="w-24"
          size="sm"
          onPress={() => router.push(`/acl/roles/notification-permissions/${row.id}`)}
        >
          اعلانات
        </Button>
      ),
    });
    return items;
  };
  return (
    <div className="app-container-profile ">
      {" "}
      {/*********************** PAGE HEADER ************************/}
      <div>
        <PageHeader title="نقش های مدیران" modelTitle="نقش" createRoute="/acl/roles/create" />
      </div>
      {/*********************** TABLE ************************/}
      <div className="my-8">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Table
              data={aclRoles}
              columns={columns || []}
              rows={aclRoles?.map((row: any) => ({
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

export default RolesListPage;
