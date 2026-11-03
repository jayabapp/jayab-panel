"use client";

import { prepareTitleTranslations } from "@/components/Content/TitleTranslationsEditor";
import { useState, useEffect } from "react";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { CreateProps } from "@/components/Table/table.type";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { produce } from "immer";

import { type TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

import TitleTranslationsEditor from "@/components/Content/TitleTranslationsEditor";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";

type State = { [key: string]: any };

const endpoint = apiRoutes.PROPERTY_OPTIONS1;

const PropertyOptionCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [translations, setTranslations] = useState<TitleTranslations>({});

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

  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);
    body = {
      ...body,
      translations: prepareTitleTranslations(translations),
    };

    console.log({ body });

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
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
          title="ایجاد"
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

export default PropertyOptionCreate;
