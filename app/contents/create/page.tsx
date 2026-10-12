"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { contentTranslationsError } from "@/helpers/content-translations";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import { SEO_FORM_ITEMS } from "@/utils/seo.constant";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { produce } from "immer";
import { Divider } from "@/components/shared/Divider";
import { slugify } from "@/helpers/slugify";
import { isEmpty } from "lodash";
import { Input } from "@nextui-org/react";
import { p2e } from "@/helpers/p2e";

import type { ContentTranslations } from "@/interfaces/content-translations";

import HomeContentTranslations from "@/components/Content/HomeContentTranslations";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";
import Detail from "@/components/Show/Details";
import Notify from "@/components/shared/Toast";

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
  const [translations, setTranslations] = useState<ContentTranslations>({});

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
    ApiCall(
      "GET",
      `${endpoint}/model-props`,
      null,
      "GET FORM ITEMS",
      ({ data }) => {
        const props = data.createProps;
        setFormItems(props || []);
        !categoryId && setIsLoading(false);
      },
    );
  };

  /**
   * get default passede category if exist - optional
   */
  const getDefaultCategory = () => {
    ApiCall(
      "GET",
      `${apiRoutes.CONTENT1}/${categoryId}`,
      null,
      "GET DEFAULT CATEGORY",
      ({ data }) => {
        const t = data?.showProps?.find((e: any) => e.state == "title")?.value;
        setStates({ category_id: { id: categoryId, title: t } });
        setIsLoading(false);
      },
    );
  };

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
              options: { isMandatory: true, keyboard: e.type },
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
      states.key === "homeContent"
        ? contentTranslationsError(translations)
        : null;
    if (error) {
      Notify({ type: "error", body: error });
      return;
    }
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    body = { ...body, fields: dynamicFieldsStates };
    body = { ...body, seo: seoStates };
    if (states.key === "homeContent") body = { ...body, translations };

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
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
          title="ایجاد"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

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
        notEditableList={[]}
      />

      {states.key === "homeContent" && (
        <HomeContentTranslations
          value={translations}
          onChange={setTranslations}
          disabled={disabled}
        />
      )}

      {/*********************** SEO ************************/}
      <>
        <Divider moreClass="my-6 border-dashed border-1" />
        <p className="mb-3 text-teal-500 font-medium text-lg">
          فیلدهای مربوط به SEO:
        </p>
        <FormBuilder
          formItems={SEO_FORM_ITEMS}
          states={seoStates}
          setStates={setSeoStates}
          notEditableList={[]}
        />
        <Divider moreClass="my-6 border-dashed border-1" />
      </>

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default ContentCreate;
