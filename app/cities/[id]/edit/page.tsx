"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";

const endpoint = apiRoutes.CITIES1;

type State = { [key: string]: any };

const CityEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [parentId, setParentId] = useState<any>();

  useEffect(() => {
    getFormItems();
  }, []);

  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props`, null, "GET FORM ITEMS", ({ data }) => {
      const props = data.createProps;
      setFormItems(props || []);
      getData(props);
    });
  };

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = (props: CreateProps[]) => {
    ApiCall("GET", `${endpoint}/${id}`, null, "GET DATA", ({ data }) => {
      prepareInitData(
        data?.showProps?.filter((e: any) => e.isEditable || e.isEditable == null),
        props
      );

      const parentId = (data.showProps.find((e: any) => e.state === "parent_id")?.value as number) || null;
      setParentId(parentId);

      //عنوان زیرگروه فقط برای والد ثبت میشه
      if (parentId) {
        setFormItems((_) => _?.filter((e) => e.state != "subgroup_title"));
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  /**
   * اماده سازی مقادیر پیش فرض
   * در صورتی که فیلد ریلیشن داشته باشد از سمت بک کلید رف بر میگرده که با توجه به اون باید دیتای پیش فرض رو جایگذاری کرد
   * @param data
   * @param props
   */
  const prepareInitData = (data: any, props: CreateProps[]) => {
    const s = prepareInitDataCreator(data, props);
    setStates(s);
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    console.log({ body });
    if (parentId) body = { ...body, parent_id: parentId };
    ApiCall(
      "PUT",
      `${endpoint}/${id}`,
      body,
      "SUBMIT EDIT",
      ({ data }) => {
        router.back();
        // setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading || !formItems) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="ویرایش" hasCreateButton={false} hasBackButton={true} />
      </div>

      {/*********************** Form Builder ************************/}
      <FormBuilder formItems={formItems} states={states} setStates={setStates} notEditableList={[]} />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default CityEdit;
