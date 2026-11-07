"use client";

import {
  CONTENT_CATEGORY_SEO_FORM_ITEMS,
  SEO_FORM_ITEMS,
} from "@/utils/seo.constant";
import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { produce } from "immer";
import { isEmpty } from "lodash";
import { ApiCall } from "@/helpers/ApiCall";
import { Divider } from "@/components/shared/Divider";
import { p2e } from "@/helpers/p2e";

import TextTranslationsEditor from "@/components/Content/TextTranslationsEditor";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";
import Detail from "@/components/Show/Details";

import {
  CATEGORY_TRANSLATED_FIELDS,
  translationsFromShowProps,
  type TextTranslations,
} from "@/components/Content/TextTranslationsEditor";

type State = { [key: string]: any };

const endpoint = apiRoutes.CONTENT1;

const ContentCategoryCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [translations, setTranslations] = useState<TextTranslations>({});
  const [seoStates, setSeoStates] = useState({});

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
        setIsLoading(false);
      },
    );
  };

  /* ------------------------- GET CHAINED STATE LIST ------------------------- */
  const getChainedStateList = (state: string, route: string) => {
    ApiCall("GET", route, null, "GET CHAINED", ({ data }) => {
      const nextState = produce(formItems, (draftState: CreateProps[]): any => {
        const index = draftState.findIndex((_) => _.state == state);
        if (index > -1) draftState[index]["selectItems"] = data;
        else formItems;
      });
      setFormItems(nextState);
    });
  };

  useEffect(() => {
    if (states["category_id"])
      getChainedStateList(
        "sub_category_id",
        `/admin/categories/parents/${states["category_id"]?.id}`,
      );
  }, [states["category_id"]]);

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);
    body = { ...body, seo: seoStates, translations };

    console.log({ body });

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
      ({ data }) => {
        router.back();
        // setDisabled(false);
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

      {/*********************** Form Builder ************************/}
      <FormBuilder
        formItems={formItems}
        states={states}
        setStates={setStates}
        notEditableList={[]}
      />

      {/*********************** TRANSLATIONS ************************/}
      <TextTranslationsEditor
        title="ترجمهٔ دسته‌بندی (انگلیسی و عربی)"
        fields={CATEGORY_TRANSLATED_FIELDS}
        persian={states}
        value={translations}
        onChange={setTranslations}
        disabled={disabled}
      />

      {/*********************** SEO ************************/}
      <>
        <Divider moreClass="my-6 border-dashed border-1" />
        <p className="mb-3 text-teal-500 font-medium text-lg">
          فیلدهای مربوط به SEO:
        </p>
        <FormBuilder
          formItems={CONTENT_CATEGORY_SEO_FORM_ITEMS}
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

export default ContentCategoryCreate;
