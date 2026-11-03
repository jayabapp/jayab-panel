"use client";

import { prepareTitleTranslations } from "@/components/Content/TitleTranslationsEditor";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { useState, useEffect } from "react";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { CreateProps } from "@/components/Table/table.type";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";

import { type TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

import TitleTranslationsEditor from "@/components/Content/TitleTranslationsEditor";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";

type State = { [key: string]: any };

const endpoint = apiRoutes.PROPERTY_OPTIONS1;

const PropertyOptionEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [translations, setTranslations] = useState<TitleTranslations>({});
  const [notEditableList, setNotEditableList] = useState<string[]>([]);

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

  const getData = (props: CreateProps[]) => {
    ApiCall("GET", `${endpoint}/${id}`, null, "GET DATA", ({ data }) => {
      prepareInitData(data.showProps, props);
      setTranslations(
        data.showProps?.find(
          (item: { state?: string }) => item.state === "translations",
        )?.value ?? {},
      );
      const list = data.showProps
        ?.filter((e: any) => e.isEditable == false)
        .map((_: any) => _.state);
      setNotEditableList(list);
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
    const body = {
      ...apiBodyCreator(states, formItems),
      translations: prepareTitleTranslations(translations),
    };
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
        formItems={formItems}
        setStates={setStates}
        notEditableList={notEditableList}
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

export default PropertyOptionEdit;
