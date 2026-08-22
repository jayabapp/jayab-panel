"use client";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import FormSelect from "@/components/Form/FormSelect";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";

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

  useEffect(() => {
    getFormItems();
  }, []);

  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props?is_parent=${id == "null" ? 1 : 0}`, null, "GET FORM ITEMS", ({ data }) => {
      let props = data.createProps;

      setFormItems(props || []);
      setIsLoading(false);
    });
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    body = { ...body, parent_id: +id, type };
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

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default CityCreate;
