"use client";

import { prepareTitleTranslations } from "@/components/Content/TitleTranslationsEditor";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { useState, useEffect } from "react";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { CreateProps } from "@/components/Table/table.type";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";

import { type TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

import TitleTranslationsEditor from "@/components/Content/TitleTranslationsEditor";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";

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
  const [translations, setTranslations] = useState<TitleTranslations>({});
  const [parentId, setParentId] = useState<any>();

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
      setTranslations(
        data.showProps?.find(
          (item: { state?: string }) => item.state === "translations",
        )?.value ?? {},
      );
      prepareInitData(
        data?.showProps?.filter(
          (e: any) => e.isEditable || e.isEditable == null,
        ),
        props,
      );
      const parentId =
        (data.showProps.find((e: any) => e.state === "parent_id")
          ?.value as number) || null;
      setParentId(parentId);
      if (parentId)
        setFormItems((_) => _?.filter((e) => e.state != "subgroup_title"));
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  const prepareInitData = (data: any, props: CreateProps[]) => {
    const s = prepareInitDataCreator(data, props);
    setStates(s);
  };

  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);
    body = { ...body, translations: prepareTitleTranslations(translations) };
    console.log({ body });
    if (parentId) body = { ...body, parent_id: parentId };
    ApiCall(
      "PUT",
      `${endpoint}/${id}`,
      body,
      "SUBMIT EDIT",
      ({ data }) => {
        router.back();
      },
      () => setDisabled(false),
    );
  };

  if (isLoading || !formItems) return <Loading />;
  return (
    <div className="app-container-profile ">
      <div>
        <PageHeader
          title="ویرایش"
          hasBackButton={true}
          hasCreateButton={false}
        />
      </div>

      <FormBuilder
        states={states}
        notEditableList={[]}
        formItems={formItems}
        setStates={setStates}
      />

      <TitleTranslationsEditor
        disabled={disabled}
        value={translations}
        onChange={setTranslations}
      />
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default CityEdit;
