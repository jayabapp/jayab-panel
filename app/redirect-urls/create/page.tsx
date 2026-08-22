"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";

type State = { [key: string]: any };

const endpoint = apiRoutes.REDIRECT_URL1;

const RedirectUrlCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});

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

  useEffect(() => {
    if (states["source"]) setStates((e) => ({ ...e, source: decodeURI(states.source) }));
  }, [states["source"]]);

  useEffect(() => {
    if (states["destination"]) setStates((e) => ({ ...e, destination: decodeURI(states.destination) }));
  }, [states["destination"]]);

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    body = {
      ...body,
      lat: +states?.coordinate?.lat,
      lng: +states?.coordinate?.lng,
    };

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

export default RedirectUrlCreate;
