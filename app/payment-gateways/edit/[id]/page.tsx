"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { NestedText } from "@/components/shared/NestedText";
import { PaymentGateway, PaymentGatewayParams } from "@/interfaces/schema.type";
import FormInput from "@/components/Form/FormInput";
import { Divider } from "@/components/shared/Divider";
import { p2e } from "@/helpers/p2e";

type State = { [key: string]: any };

const endpoint = apiRoutes.PAYMENT_GATEWAY1;

const PaymentGatewayEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PaymentGateway>();
  const [editedParams, setEditedParams] = useState<PaymentGatewayParams[]>([]);
  const [states, setStates] = useState<State>({});
  const [notEditableList, setNotEditableList] = useState<string[]>([]);

  useEffect(() => {
    getData();
  }, []);

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = () => {
    ApiCall("GET", `${endpoint}/${id}`, null, "GET DATA", ({ data }) => {
      setData(data);
      setEditedParams(data.params);
      setIsLoading(false);
    });
  };

  const onChange = (key: string, value: string) => {
    // const next =
    setEditedParams((e) =>
      produce(e, (draft) => {
        const index = e.findIndex((e) => e.key === key);
        draft[index].value = p2e(value);
      })
    );
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = { params: editedParams };

    console.log({ body });

    ApiCall(
      "PUT",
      `${endpoint}/${id}`,
      body,
      "SUBMIT EDIT",
      ({ data }) => {
        router.back();
        // setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="ویرایش" hasCreateButton={false} hasBackButton={true} />
      </div>
      <img src={data.logo} className="w-24 mx-auto my-4" />
      <NestedText firstText={"نام درگاه"} secondText={data.title} />
      <Divider moreClass="my-6" />
      <p className="text-lg text-warning mb-4 font-bold">
        اطلاعات درگاه:
        <span className="text-sm text-danger mr-2">
          در صورت وارد کردن اطلاعات اشتباه درگاه شما از دسترس خارج می شود
        </span>
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {editedParams?.map((e, i) => (
          <FormInput key={i} title={e.title} onChangeText={(v) => onChange(e.key, v)} value={e.value} showX={false} />
        ))}
      </div>
      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default PaymentGatewayEdit;
