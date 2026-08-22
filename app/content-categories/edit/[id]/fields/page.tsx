"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";

import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import { Button } from "@nextui-org/react";
import { Divider } from "@/components/shared/Divider";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

type State = { [key: string]: any };

const endpoint = apiRoutes.CONTENT1;

const dynamicFieldsForm: CreateProps[] = [
  {
    title: "عنوان",
    type: "input",
    state: "title",
    options: {},
  },
  {
    title: "کلید",
    type: "input",
    state: "key",
    options: {},
  },
  {
    title: "نوع ورودی",
    type: "select",
    state: "type",
    selectItems: [
      { id: "text", title: "نوشتاری" },
      { id: "number", title: "عددی" },
      // { id: "select", title: "انتخابی" },
    ],
    options: {},
  },
];

const ContentCategoryEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<State>({});
  const [data, setData] = useState([]);
  const [deleteDisabled, setDeleteDisabled] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = () => {
    ApiCall("GET", `${endpoint}/${id}`, null, "GET DATA", ({ data }) => {
      setData(data?.showProps?.find((e: ShowProps) => e.state == "dynamic_fields")?.value || []);
      setIsLoading(false);
    });
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = {
      key: states.key,
      title: states.title,
      type: states.type?.id,
    };

    console.log({ body });

    ApiCall(
      "POST",
      `${endpoint}/${id}/dynamic-fields`,
      body,
      "SUBMIT FIELDS",
      ({ data }) => {
        getData();
        setStates({});
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };
  /* -------------------------------- ON DELETE ------------------------------- */
  const onDelete = (key: string) => {
    setDeleteDisabled(true);
    ApiCall(
      "DELETE",
      `${endpoint}/${id}/dynamic-fields/${key}`,
      null,
      "DELETE FIELDS",
      ({ data }) => {
        getData();
        setDeleteDisabled(false);
      },
      () => setDeleteDisabled(false)
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="فیلدهای اضافی" hasCreateButton={false} hasBackButton={true} />
      </div>

      {/*********************** Form Builder ************************/}

      <div className="w-full flex items-center">
        <FormBuilder formItems={dynamicFieldsForm} states={states} setStates={setStates} notEditableList={[]} />

        <Button color="primary" className="mt-3 mr-5" disabled={disabled} isLoading={isLoading} onPress={onSubmit}>
          ثبت
        </Button>
      </div>

      <Divider moreClass="my-3" />
      <p className="mb-3 text-primary">فیلدهای ثبت شده:</p>
      <div className="w-1/2 pb-20">
        {data?.map((e: any, i) => (
          <div key={i} className="grid grid-cols-4  items-center py-4">
            <p>{e.title}</p>
            <p>{e.key}</p>
            <div className="flex gap-5 justify-end">
              <Button
                color="danger"
                className="cursor-pointer"
                size="sm"
                disabled={deleteDisabled}
                isLoading={deleteDisabled}
                isIconOnly
                onPress={() => onDelete(e.key)}
              >
                <TrashIcon className="w-4" />
              </Button>
              <Button
                color="warning"
                size="sm"
                disabled={deleteDisabled}
                isLoading={deleteDisabled}
                isIconOnly
                onPress={() => setStates({ key: e.key, title: e.title })}
              >
                <PencilIcon className="w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentCategoryEdit;
