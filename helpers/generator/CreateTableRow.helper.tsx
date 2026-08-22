import { Column, ColumnComponent } from "@/components/Table/table.type";
import findTableCellValue from "./findTableCellValue";
import Cell from "@/components/Table/Cell";
import FormInput from "@/components/Form/FormInput";
import { produce } from "immer";
import { p2e } from "../p2e";
import FormSelect from "@/components/Form/FormSelect";
import { get } from "lodash";
import FormSelectMulti from "@/components/Form/FormSelectMulti";
import { Checkbox } from "@nextui-org/react";
import checkTableCellCondition from "./checkTableCellCondition";

/* ---------------------------- CREATE TABLE ROWS --------------------------- */
const createTableRowsHelper = (
  rowData: any,
  columns: Column[] | undefined,
  updatedStates: any,
  setUpdatedStates: Function
) => {
  let items: ColumnComponent[] = [];

  for (const col of columns || []) {
    let editableList = [];
    if (typeof col.editableList == "string")
      editableList = get(rowData, col.editableList);
    else if (Array.isArray(col.editableList)) editableList = col.editableList;

    if (col.key == "id") continue;
    const value = findTableCellValue(rowData, col);
    const component = !col.isEditable ? (
      <Cell
        value={value}
        cellType={col.cellType}
        optionalClass={
          checkTableCellCondition(value, col.conditions) || col.optionalClass
        }
        link={!!col.link ? `${col.link}/${rowData[col.key]?.id}` : undefined}
        linkTitle={col.linkTitle}
      />
    ) : !!col.editableList && col.is_multiselect ? (
      <div className="" style={{ minWidth: 180 }}>
        <FormSelectMulti
          options={col.formOptions || { containerClass: "-mt-6" }}
          title=""
          list={editableList}
          onSelect={(v) => {
            setUpdatedStates(
              produce((draft: any) => {
                if (!draft[rowData.id]) draft[rowData.id] = [];
                draft[rowData.id] = {
                  ...draft[rowData.id],
                  [col.update_key || col.key]: v,
                };
              })
            );
          }}
          value={
            updatedStates[rowData.id]?.[col.update_key || col.key] ??
            findTableCellValue(rowData, col)
          }
        />
      </div>
    ) : !!col.isEditable && col.cellType == "boolean" ? (
      <div className="" style={{ minWidth: 20 }}>
        <Checkbox
          title=""
          onValueChange={(v) => {
            console.log({ v });

            setUpdatedStates(
              produce((draft: any) => {
                if (!draft[rowData.id]) draft[rowData.id] = [];
                draft[rowData.id] = {
                  ...draft[rowData.id],
                  [col.update_key || col.key]: v,
                };
              })
            );
          }}
          isSelected={
            updatedStates[rowData.id]?.[col.update_key || col.key] ??
            findTableCellValue(rowData, col)
          }
        />
      </div>
    ) : !!col.editableList ? (
      <div className="" style={{ minWidth: 180 }}>
        <FormSelect
          options={col.formOptions || { containerClass: "-mt-6" }}
          title=""
          list={editableList}
          onSelect={(v) => {
            setUpdatedStates(
              produce((draft: any) => {
                if (!draft[rowData.id]) draft[rowData.id] = {};
                draft[rowData.id] = {
                  ...draft[rowData.id],
                  [col.update_key || col.key]: v,
                };
              })
            );
          }}
          value={
            updatedStates[rowData.id]?.[col.update_key || col.key] ??
            findTableCellValue(rowData, col)
          }
          showX={false}
        />
      </div>
    ) : (
      <div className="" style={{ minWidth: 120 }}>
        <FormInput
          options={{
            ...(col.formOptions || { containerClass: "-mt-5" }),
            id: rowData.id,
          }}
          title=""
          onChangeText={(v) => {
            setUpdatedStates(
              produce((draft: any) => {
                if (!draft[rowData.id]) draft[rowData.id] = {};
                draft[rowData.id] = {
                  ...draft[rowData.id],
                  [col.update_key || col.key]: v,
                };
              })
            );
          }}
          value={
            updatedStates[rowData.id]?.[col.update_key || col.key] ??
            findTableCellValue(rowData, col)
          }
          showX={false}
        />
      </div>
    );

    items.push({
      id: col.id,
      component: () => component,
    });
  }
  return items;
};

export default createTableRowsHelper;
