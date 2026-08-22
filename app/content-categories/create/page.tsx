"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";

import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import Detail from "@/components/Show/Details";
import { Button, Input } from "@nextui-org/react";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { Divider } from "@/components/shared/Divider";
import { CONTENT_CATEGORY_SEO_FORM_ITEMS, SEO_FORM_ITEMS } from "@/utils/seo.constant";

type State = { [key: string]: any };

const endpoint = apiRoutes.CONTENT1;

const ContentCategoryCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [seoStates, setSeoStates] = useState({});

  useEffect(() => {
    getFormItems();
  }, []);

  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props`, null, "GET FORM ITEMS", ({ data }) => {
      const props = data.createProps;
      setFormItems(props || []);
      setIsLoading(false);
    });
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

  //به ازای هر لیست وابسته یکبار این تابع نوشته می شود
  useEffect(() => {
    if (states["category_id"])
      getChainedStateList("sub_category_id", `/admin/categories/parents/${states["category_id"]?.id}`);
  }, [states["category_id"]]);

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);
    body = { ...body, seo: seoStates };

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

      {/*********************** Form Builder ************************/}
      <FormBuilder formItems={formItems} states={states} setStates={setStates} notEditableList={[]} />

      {/*********************** SEO ************************/}
      <>
        <Divider moreClass="my-6 border-dashed border-1" />
        <p className="mb-3 text-teal-500 font-medium text-lg">فیلدهای مربوط به SEO:</p>
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
