"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import {
  ActionButton,
  Column,
  CreateProps,
  EnumList,
  ShowProps,
  TableServerProps,
} from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { Divider } from "@/components/shared/Divider";
import { Button } from "@nextui-org/react";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Table from "@/components/Table";
import DeleteButton from "@/components/Table/Action/DeleteButton";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import EditButton from "@/components/Table/Action/EditButton";
import Notify from "@/components/shared/Toast";
import createTableRowsHelper from "@/helpers/generator/CreateTableRow.helper";
import SaveButton from "@/components/Table/Action/SaveButton";

type State = { [key: string]: any };
enum FormBuilderInputType {
  SELECT = "select",
  MULTI_SELECT = "multi_select",
  INPUT = "input",
  TEXT_AREA = "textarea",
  IMAGE = "image",
  TITLE = "title",
  BREAK = "break",
}

const formBuilderInputList: EnumList[] = [
  { id: FormBuilderInputType.INPUT, title: "تایپی", hex: "#0EA5E9" },
  { id: FormBuilderInputType.TEXT_AREA, title: "تایپی - چند خطی", hex: "#10B981" },
  { id: FormBuilderInputType.SELECT, title: "لیست انتخابی", hex: "#6366F1" },
  { id: FormBuilderInputType.MULTI_SELECT, title: "لیست چند انتخابی", hex: "#FACC15" },
  { id: FormBuilderInputType.IMAGE, title: "تصویر", hex: "#F97316" },
  { id: FormBuilderInputType.TITLE, title: "عنوان", hex: "#06B6D4" },
  { id: FormBuilderInputType.BREAK, title: "سطر جدید", hex: "#8B5CF6" },
];

const endpoint = apiRoutes.FORM1;

const ContentFormBuilder = () => {
  const router = useRouter();
  const params = useParams();
  const contentId = params?.id;

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formItems, setFormItems] = useState<CreateProps[]>();
  const allFormItems = useRef<CreateProps[]>([]);

  const [states, setStates] = useState<State>({});

  const [items, setItems] = useState([]);

  const [contentTitle, setContentTitle] = useState<string>();
  const [tableProps, setTableProps] = useState<TableServerProps>();
  const [deleteModalisVisible, setDeleteModalIsVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [updatedStates, setUpdatedStates] = useState<any>({});
  const [editableColumns, setEditableColumns] = useState<Array<string>>([]);

  useEffect(() => {
    getContent();
    getFormItems();
  }, []);

  useEffect(() => {
    if (![FormBuilderInputType.SELECT, FormBuilderInputType.MULTI_SELECT].includes(states?.type?.id)) {
      const x = allFormItems?.current?.filter((e) => e.state != "options") || [];
      setFormItems(x);
    } else setFormItems(allFormItems.current);
  }, [states?.type?.id]);

  const getContent = () => {
    ApiCall("GET", `${apiRoutes.CONTENT2}/${contentId}`, null, "GET CONTENT", ({ data }: { data: any }) => {
      const contentTitle = data?.showProps?.find((e: ShowProps) => ["title"].includes(e.state as string))?.value;
      setContentTitle(contentTitle);
      getFormItems();
    });
  };

  /* -------------------------------- GET MODEL PROPS ------------------------------- */
  const { columns } = tableProps || {};
  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props`, null, "GET MODEL PROPS", ({ data }: { data: any }) => {
      setTableProps(data.tableProps || {});
      //   setFormItems(data.createProps || []);
      setStates({ type: formBuilderInputList[0] });
      allFormItems.current = data.createProps;

      const editableColumnsKey: string[] = [];
      data?.tableProps?.columns?.map((e: Column) => {
        if (e.isEditable) editableColumnsKey.push(e.update_key || e.key);
      });
      setEditableColumns(editableColumnsKey);

      getList();
    });
  };

  const getList = () => {
    ApiCall("GET", `${endpoint}?page=1&per_page=1000&content_id=${contentId}`, null, "GET ITEMS", ({ data }) => {
      setItems(data.data);
      setIsLoading(false);
    });
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    if (!states?.type?.id) return Notify({ type: "error", body: "نوع ورودی را انتخاب کنید" });

    setDisabled(true);
    let body = apiBodyCreator(states, formItems);
    body = { ...body, content_id: +contentId, type: states?.type?.id };
    if (![FormBuilderInputType.SELECT, FormBuilderInputType.MULTI_SELECT].includes(states?.type?.id)) body.options = [];

    console.log({ body });

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
      () => {
        setDisabled(false);
        getList();
        setStates({});
        setSelectedItemId(null);
        setStates({ type: formBuilderInputList[0] });
      },
      () => setDisabled(false)
    );
  };

  /* -------------------------------- DELETE ------------------------------- */
  const onDelete = () => {
    ApiCall("DELETE", `${endpoint}/${selectedItemId}`, null, `DELETE ATTR`, () => {
      getList();
      setDeleteModalIsVisible(false);
      setStates({});
      setSelectedItemId(null);
    });
  };

  /* -------------------------------- UPDATE ------------------------------- */
  const onUpdate = () => {
    let body = apiBodyCreator(states, formItems);
    body = { ...body, content_id: +contentId };
    console.log({ body });

    ApiCall("PUT", `${endpoint}/${selectedItemId}`, body, `UPDATE ATTR`, () => {
      getList();
      setStates({});
      setSelectedItemId(null);
    });
  };

  /* ---------------------------- CREATE TABLE ROWS --------------------------- */
  const createTableRows = (rowData: any) => {
    const items = createTableRowsHelper(rowData, columns, updatedStates, setUpdatedStates);
    return items;
  };

  const createTableActions = (row: any) => {
    const items: ActionButton[] = [];

    items.push({
      id: 4,
      component: (
        <EditButton
          onPress={() => {
            setStates({
              title: row.title,
              options: row.options,
              sort_order: row.sort_order,
              is_mandatory: row.is_mandatory,
              type: formBuilderInputList.find((e) => e.id == row.type) || {},
            });
            setSelectedItemId(row.id);
          }}
        />
      ),
    });
    items.push({
      id: 4,
      component: (
        <SaveButton isChanged={!!updatedStates[row.id]} disabled={disabled} onPress={() => onSubmitEditedRow(row)} />
      ),
    });
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
    return items;
  };

  /* ------------------- SUBMIT FUNCTION FOR EDITABLE COLUMNS ------------------ */
  const onSubmitEditedRow = (row: any) => {
    const rowId: number = row.id;

    setDisabled(true);
    let body: any = {};
    editableColumns.map((key) => {
      if (typeof updatedStates[rowId]?.[key] == "boolean") body[key] = updatedStates[rowId]?.[key];
      else body[key] = updatedStates[rowId]?.[key]?.id || updatedStates[rowId]?.[key] || row[key];
    });

    ApiCall(
      "PATCH",
      `${endpoint}/${rowId}/update-partial`,
      body,
      "SUBMIT EDIT",
      ({ data }) => {
        getList();
        setUpdatedStates(
          produce((draft: any) => {
            delete draft[rowId];
          })
        );
        setDisabled(false);
      },
      () => {
        setUpdatedStates(
          produce((draft: any) => {
            delete draft[rowId];
          })
        );
        setDisabled(false);
      }
    );
  };

  if (isLoading || !formItems || !tableProps) return <Loading />;

  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title={`فرم ساز: ${contentTitle}`} hasCreateButton={false} hasBackButton={true} />
      </div>
      {/* <p className="font-bold text-lg pr-2 mb-4 mt-6">ایجاد گروه انتخابی جدید:</p> */}

      <>
        {/*********************** Form Builder ************************/}
        <div className="">
          <FormBuilder formItems={formItems} states={states} setStates={setStates} notEditableList={[]} />
        </div>
        <div className="flex lg:float-left gap-4 mb-8">
          <Button
            color="primary"
            className="px-6 ml-3 w-full md:w-1/2 lg:w-fit mx-auto"
            startContent={<CloudArrowUpIcon className="w-6" />}
            disabled={disabled}
            isLoading={disabled}
            onPress={selectedItemId ? onUpdate : onSubmit}
          >
            {selectedItemId ? "ویرایش" : "ثبت"}
          </Button>
          {selectedItemId && (
            <Button
              color="danger"
              className="px-6 ml-3"
              startContent={<XMarkIcon className="w-6" />}
              disabled={disabled}
              isLoading={disabled}
              onPress={() => {
                setStates({});
                setSelectedItemId(null);
              }}
            >
              {"لغو ویرایش"}
            </Button>
          )}
        </div>
        <Divider moreClass="mt-20" />

        {/*********************** TABLE ************************/}
        <div className="mt-6">
          <Table
            data={items}
            columns={columns || []}
            rows={items?.map((row: any) => ({
              id: row.id,
              items: createTableRows(row),
              actions: createTableActions(row),
            }))}
          />
        </div>
      </>

      {/*********************** DELETE MODAL  ************************/}
      <ConfirmModal
        text={"آیا میخواهید این آیتم را حذف کنید؟"}
        isVisible={deleteModalisVisible}
        isLoading={disabled}
        onHide={() => {
          setDeleteModalIsVisible(false);
          setSelectedItemId(null);
        }}
        onConfirm={() => {
          onDelete();
        }}
      />
    </div>
  );
};

export default ContentFormBuilder;
