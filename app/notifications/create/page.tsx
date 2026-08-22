"use client";
import { useSearchParams } from "next/navigation";
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
import { useQueryGet } from "@/helpers/query-get.hooks";
import Notify from "@/components/shared/Toast";

type State = { [key: string]: any };

const endpoint = apiRoutes.NOTIFICATIONS1;

const NotificationCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const queriesParams = useQueryGet<any>();
  const type = queriesParams?.type;

  useEffect(() => {
    setStates({});
    getFormItems();
  }, [type]);

  const getFormItems = () => {
    ApiCall(
      "GET",
      `${endpoint}/model-props?type=${type}`,
      null,
      "GET FORM ITEMS",
      ({ data }) => {
        const props = data.createProps;
        setFormItems(props || []);
        setIsLoading(false);
      }
    );
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    if (!states["mobile_numbers"] && !states["topic"]) {
      setDisabled(false);

      return Notify({
        type: "warn",
        body: "مقادیر الزامی را به درستی انتخاب کنید",
      });
    }

    body = {
      ...body,
      // mobile_numbers: type == "MOBILE" ? states["mobile_numbers"] : null,
      // topic: type == "GROUP" ? states["topic"] : null,
      type,
    };

    console.log({ body });

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
      ({ data }) => {
        router.push("/notifications");
      },
      () => setDisabled(false)
    );
    setDisabled(false);
    setIsLoading(false);
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

      {/*********************** WARNS ************************/}
      {type == "1" && (
        <div className="border w-fit border-red-400 p-3 rounded-10 ml-1 mt-3 mb-4">
          <p className="text-red-500 my-2 text-lg font-bold">
            ⚠️ موارد زیر را حتما در نظر داشته باشید
          </p>

          <ul className="text-sm font-light text-gray-400 list-disc mr-5">
            <li>وارد کردن حداقل یک شماره موبایل الزامی است.</li>
            <li>حداکثر ۱۰۰ شماره میتوانید وارد کنید.</li>
            <li>حتما مانند الگو گفته شده شماره‌ها را وارد نمایید.</li>
            <li>
              در صورتی که شماره‌های وارد شده صحیح نباشند، اعلان ارسال نخواهد شد.
            </li>
            <li>شماره های تکراری حذف خواهند شد.</li>
          </ul>
        </div>
      )}

      {/*********************** Form Builder ************************/}
      <FormBuilder
        formItems={formItems}
        states={states}
        setStates={setStates}
        notEditableList={[]}
      />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default NotificationCreate;
