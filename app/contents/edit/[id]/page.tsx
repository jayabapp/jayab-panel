"use client";

import { contentTranslationsError } from "@/helpers/content-translations";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { ShowAction, ShowProps } from "@/components/Table/table.type";
import { isEmpty, omit, pick } from "lodash";
import { useState, useEffect } from "react";
import { SEO_FORM_ITEMS } from "@/utils/seo.constant";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { CreateProps } from "@/components/Table/table.type";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { useParams } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import { produce } from "immer";
import { Divider } from "@/components/shared/Divider";
import { p2e } from "@/helpers/p2e";

import type { ContentTranslations } from "@/interfaces/content-translations";

import ContentTranslationsEditor from "@/components/Content/ContentTranslationsEditor";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import ShowActions from "@/components/Show/ShowActions";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";
import Notify from "@/components/shared/Toast";

type State = { [key: string]: any };

const endpoint = apiRoutes.CONTENT2;

const ContentEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});

  const [dynamicFields, setDynamicFields] = useState<CreateProps[]>([]);
  const [dynamicFieldsStates, setDynamicFieldsStates] = useState({});

  const [seoStates, setSeoStates] = useState({});
  const [translations, setTranslations] = useState<ContentTranslations>({});
  const [notEditableList, setNotEditableList] = useState<string[]>([]);
  const [actions, setActions] = useState<ShowAction[]>([]);

  useEffect(() => {
    getFormItems();
  }, []);

  const getFormItems = () => {
    ApiCall(
      "GET",
      `${endpoint}/model-props`,
      null,
      "GET FORM ITEMS",
      ({ data }) => {
        const props = data.createProps;
        setFormItems(props || []);
        getData(props);
      },
    );
  };

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = (props: CreateProps[]) => {
    ApiCall("GET", `${endpoint}/${id}`, null, "GET DATA", ({ data }) => {
      prepareInitData(
        data.showProps?.filter(
          (e: any) => e.isEditable || e.isEditable == null,
        ),
        props,
      );
      setActions(data?.actions || []);

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
  const prepareInitData = (data: ShowProps[], props: CreateProps[]) => {
    const s = prepareInitDataCreator(data, props);
    setStates(s);

    const df = data.find((e) => e.state == "fields")?.value || {};
    setDynamicFieldsStates(df);

    const seo = data.find((e) => e.state == "seo")?.value || {};
    setSeoStates(seo);
    setTranslations(data.find((e) => e.state === "translations")?.value || {});
  };

  /* ----------------------------- dynamic fields ----------------------------- */
  useEffect(() => {
    if (states["category_id"]) {
      ApiCall(
        "GET",
        `${apiRoutes.CONTENT1}/${states["category_id"]?.id}`,
        null,
        "GET FIELDS",
        ({ data }) => {
          const f =
            data?.showProps?.find((e: ShowProps) => e.state == "dynamic_fields")
              ?.value || [];
          let form: CreateProps[] = [];
          f?.map((e: any) => {
            form.push({
              title: e.title,
              state: e.key,
              type: "input",
              options: { isMandatory: true },
            });
          });
          setDynamicFields(form);
        },
      );
    }
  }, [states["category_id"]]);

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    const error =
      states.key === "homeContent" || states.key === "terms"
        ? contentTranslationsError(translations, states.key)
        : null;
    if (error) {
      Notify({ type: "error", body: error });
      return;
    }
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    //حذف کلیدهای اشتباه در صورتی که دسته بندی رو کاربر عوض کنه
    const df = pick(
      dynamicFieldsStates,
      dynamicFields?.map((e) => e.state),
    );

    body = { ...body, fields: df };
    body = { ...body, seo: seoStates };

    if (states.key === "homeContent" || states.key === "terms")
      body = { ...body, translations };

    ApiCall(
      "PUT",
      `${endpoint}/${id}`,
      body,
      "SUBMIT EDIT",
      ({ data }) => {
        router.back();
        setDisabled(false);
      },
      () => setDisabled(false),
    );
  };

  if (isLoading || !formItems) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title="ویرایش"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      {/*********************** ACTIONS ************************/}
      <ShowActions actions={actions} />

      {/*********************** Form Builder Dynamic fields ************************/}
      {!isEmpty(dynamicFields) && (
        <>
          <Divider moreClass="my-6 border-dashed border-1" />
          <p className="mb-3 text-teal-500 font-medium text-lg">
            فیلدهای اضافی برای این دسته بندی:
          </p>
          <FormBuilder
            formItems={dynamicFields}
            states={dynamicFieldsStates}
            setStates={setDynamicFieldsStates}
            notEditableList={[]}
          />
          <Divider moreClass="my-6 border-dashed border-1" />
        </>
      )}

      {/*********************** Form Builder ************************/}
      <FormBuilder
        formItems={formItems}
        states={states}
        setStates={setStates}
        notEditableList={notEditableList || []}
      />

      {(states.key === "homeContent" || states.key === "terms") && (
        <ContentTranslationsEditor
          contentKey={states.key}
          value={translations}
          onChange={setTranslations}
          disabled={disabled}
        />
      )}

      {/*********************** SEO ************************/}
      <div className="ltr pb-16">
        <Divider moreClass="my-6 border-dashed border-1" />
        <p className="mb-3 text-teal-500 font-medium text-lg">SEO:</p>
        <FormBuilder
          formItems={SEO_FORM_ITEMS}
          states={seoStates}
          setStates={setSeoStates}
          notEditableList={[]}
        />
        <Divider moreClass="my-6 border-dashed border-1" />
      </div>

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default ContentEdit;
