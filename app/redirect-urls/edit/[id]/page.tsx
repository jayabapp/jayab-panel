"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";

type State = { [key: string]: any };

const endpoint = apiRoutes.REDIRECT_URL1;

const RedirectUrlEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [notEditableList, setNotEditableList] = useState<string[]>([]);

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
      prepareInitData(data.showProps, props);

      const list = data.showProps?.filter((e: any) => e.isEditable == false).map((_: any) => _.state);

      setNotEditableList(list);

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

  useEffect(() => {
    if (states["source"]) setStates((e) => ({ ...e, source: decodeURI(states.source) }));
  }, [states["source"]]);

  useEffect(() => {
    if (states["destination"]) setStates((e) => ({ ...e, destination: decodeURI(states.destination) }));
  }, [states["destination"]]);

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    console.log({ body });

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
      <FormBuilder formItems={formItems} states={states} setStates={setStates} notEditableList={notEditableList} />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default RedirectUrlEdit;
