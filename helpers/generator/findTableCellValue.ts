import { Column } from "@/components/Table/table.type";
import { get } from "lodash";
import moment from "moment-jalaali";

const findTableCellValue = (rowData: any, col: Column) => {
  const value = col.nestedKey
    ? get(rowData[col.key], col.nestedKey)
    : rowData[col.key];
  switch (col.cellType) {
    case "object":
      return col.nestedKey ? value : "Please define nestedKey";
    case "date":
      return value ? moment(value).format("jYYYY/jMM/jDD") : " - ";
    case "dateTime":
      return value ? moment(value).format("jYYYY/jMM/jDD HH:mm:ss") : " - ";
    case "enum":
      return col.enumList?.find((e) => e.id == value);
    default:
      return value ?? "";
  }
};

export default findTableCellValue;
