"use client";

import { prepareTitleTranslations } from "@/components/Content/TitleTranslationsEditor";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { CreateProps } from "@/components/Table/table.type";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { isEmpty } from "lodash";
import { produce } from "immer";
import { p2e } from "@/helpers/p2e";

import { type TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

import TitleTranslationsEditor from "@/components/Content/TitleTranslationsEditor";
import SubmitButton from "@/components/Form/SubmitButton";
import FormBuilder from "@/components/Form/FormBuilder";
import PageHeader from "@/components/Table/PageHeader";
import FormSelect from "@/components/Form/FormSelect";
import Loading from "@/components/shared/Loading";

type State = { [key: string]: any };

const endpoint = apiRoutes.CITIES1;

const CityCreate = () => {
  const router = useRouter();
  const params = useParams();
  const { id, type } = params || {};
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
      `${endpoint}/model-props?is_parent=${id == "null" ? 1 : 0}`,
      null,
      "GET FORM ITEMS",
      ({ data }) => {
        let props = data.createProps;
        setFormItems(props || []);
        setIsLoading(false);
      },
    );
  };

  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);
    body = {
      ...body,
      parent_id: id === "null" ? null : +id,
      type,
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

export default CityCreate;
