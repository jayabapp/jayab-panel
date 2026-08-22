"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";

import { Divider } from "@/components/shared/Divider";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import Detail from "@/components/Show/Details";
import { Input } from "@nextui-org/react";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import { SEO_FORM_ITEMS } from "@/utils/seo.constant";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { slugify } from "@/helpers/slugify";

type State = { [key: string]: any };

const endpoint = apiRoutes.CONTENT2;

const ContentCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});

  const [dynamicFields, setDynamicFields] = useState<CreateProps[]>([]);
  const [dynamicFieldsStates, setDynamicFieldsStates] = useState({});

  const [seoStates, setSeoStates] = useState({});

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");

  useEffect(() => {
    getFormItems();
    categoryId && getDefaultCategory();
  }, []);

  useEffect(() => {
    setStates((e) => ({ ...e, slug: slugify(states?.title) }));
  }, [states?.title]);

  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props`, null, "GET FORM ITEMS", ({ data }) => {
      const props = data.createProps;
      setFormItems(props || []);
      !categoryId && setIsLoading(false);
    });
  };

  /**
   * get default passede category if exist - optional
   */
  const getDefaultCategory = () => {
    ApiCall("GET", `${apiRoutes.CONTENT1}/${categoryId}`, null, "GET DEFAULT CATEGORY", ({ data }) => {
      const t = data?.showProps?.find((e: any) => e.state == "title")?.value;
      setStates({ category_id: { id: categoryId, title: t } });
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (states["category_id"]) {
      ApiCall("GET", `${apiRoutes.CONTENT1}/${states["category_id"]?.id}`, null, "GET FIELDS", ({ data }) => {
        const f = data?.showProps?.find((e: ShowProps) => e.state == "dynamic_fields")?.value || [];
        let form: CreateProps[] = [];
        f?.map((e: any) => {
          form.push({
            title: e.title,
            state: e.key,
            type: "input",
            options: { isMandatory: true, keyboard: e.type },
          });
        });
        setDynamicFields(form);
      });
    }
  }, [states["category_id"]]);

  // console.log({ seoStates });

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    body = { ...body, fields: dynamicFieldsStates };
    body = { ...body, seo: seoStates };
    console.log({ body });

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
      ({ data }) => {
        router.back();
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading || !formItems) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="ایجاد" hasCreateButton={false} hasBackButton={true} />
      </div>

      {/*********************** Form Builder Dynamic fields ************************/}
      {!isEmpty(dynamicFields) && (
        <>
          <Divider moreClass="my-6 border-dashed border-1" />
          <p className="mb-3 text-teal-500 font-medium text-lg">فیلدهای اضافی برای این دسته بندی:</p>
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
      <FormBuilder formItems={formItems} states={states} setStates={setStates} notEditableList={[]} />

      {/*********************** SEO ************************/}
      <>
        <Divider moreClass="my-6 border-dashed border-1" />
        <p className="mb-3 text-teal-500 font-medium text-lg">فیلدهای مربوط به SEO:</p>
        <FormBuilder formItems={SEO_FORM_ITEMS} states={seoStates} setStates={setSeoStates} notEditableList={[]} />
        <Divider moreClass="my-6 border-dashed border-1" />
      </>

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default ContentCreate;
