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
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";

type State = { [key: string]: any };

const endpoint = apiRoutes.CONTENT3;

const ContentQuestionCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const params = useParams();
  const searchParams = useSearchParams();
  const contentId: number = Number(searchParams?.get("content_id")) ?? 0;

  useEffect(() => {
    getFormItems();
  }, []);

  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props`, null, "GET FORM ITEMS", ({ data }) => {
      const props = data.createProps;
      setFormItems(props || []);
      getDefaultContent();
    });
  };

  const getDefaultContent = () => {
    if (!contentId) return setIsLoading(false);

    ApiCall("GET", `${apiRoutes.CONTENT2}/${contentId}`, null, "GET DEFAULT CONTENT", ({ data }) => {
      const t = data?.showProps?.find((e: any) => e.state == "title")?.value;
      setStates({ content_id: { id: contentId, title: t } });
      setIsLoading(false);
    });
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

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

      <p className="bg-danger/10 text-danger px-3 py-2 rounded-8 border border-danger w-fit mb-10 font-medium">
        اگر محتوا انتخاب شود، دسته بندی در نظر گرفته نمی شود
      </p>
      {/*********************** Form Builder ************************/}
      <FormBuilder
        formItems={formItems}
        states={states}
        setStates={setStates}
        notEditableList={contentId ? ["content_id"] : []}
      />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default ContentQuestionCreate;
