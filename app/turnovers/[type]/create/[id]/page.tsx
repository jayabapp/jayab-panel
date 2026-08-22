"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import {
  CreateProps,
  ShowAction,
  ShowProps,
} from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { Divider } from "@/components/shared/Divider";
import Detail from "@/components/Show/Details";
import ShowActions from "@/components/Show/ShowActions";
import Notify from "@/components/shared/Toast";

const endpoint = apiRoutes.TURNOVER1;
const reportEndpoint = apiRoutes.REPORTS;
const types = [
  { id: 1, title: "کسر", key: "decrease" },
  { id: 2, title: "افزایش", key: "increase" },
];
type State = { [key: string]: any };

const createForm = (businessType: string) => {
  let formInit: Array<CreateProps> = [
    {
      state: "amount",
      title: "مبلغ تراکنش",
      type: "input",
      options: {
        isMandatory: true,
        keyboard: "number",
        placeholder: "۱۲۰۰۰۰",
        titleHint: "به تومان",
        convertToText: true,
      },
    },
    {
      state: "description",
      title: "توضیحات تراکنش",
      type: "input",
      options: {
        isMandatory: true,
        keyboard: "text",
        maxLength: 500,
        placeholder: "پرداخت ۱۲۰۰۰۰ تومان به رستوران شاندیز",
      },
    },
  ];

  if (businessType !== "business")
    formInit = [
      ...formInit,
      {
        state: "type",
        title: "عملیات",
        type: "select",
        selectItems: types,
        options: {
          isMandatory: true,
        },
      },
    ];

  return formInit;
};

const CreateTurnover = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<State>({ day: {} });
  const [list, setList] = useState([]);
  const [notEditableList, setNotEditableList] = useState<string[]>([]);
  const [deleteDisable, setDeleteDisable] = useState(false);
  const [data, setData] = useState<ShowProps[]>([]);
  const [actions, setActions] = useState<ShowAction[]>([]);
  const businessType: any = params?.type;

  useEffect(() => {
    getReports();
  }, []);

  /* ---------------------- GET BUSINESS TURNOVERS REPORT --------------------- */
  const getReports = () => {
    const queryKey = businessType === "business" ? "business_id" : "user_id";

    ApiCall(
      "GET",
      `${reportEndpoint}?${queryKey}=${id}`,
      null,
      "GET DATA",
      ({ data }: { data: any }) => {
        let showProps: ShowProps[] = [];

        if (businessType === "business") {
          showProps = [
            {
              state: "total_business_revenue",
              title: "مجموع فروش با مالیات",
              type: "number",
              value:
                data?.total_businesses_receivables_amount +
                data.total_commissions,
            },
            {
              state: "total_commissions",
              title: "مجموع کمیسیون",
              type: "number",
              value: data?.total_commissions,
            },
            {
              state: "total_business_revenue",
              title: "مجموع درآمد",
              type: "number",
              value: data?.total_businesses_receivables_amount,
            },
            {
              state: "total_paid_to_businesses",
              title: "مجموع مبلغ پرداخت شده به فروشگاه",
              type: "number",
              value: data?.total_paid_to_businesses,
            },
            {
              state: "business_receivables_amount",
              title: "بستانکاری کسب و کار",
              type: "number",
              value:
                data?.total_businesses_receivables_amount -
                data.total_paid_to_businesses,
            },
          ];

          setActions([
            {
              route: `/turnovers/businesses?page=1&filters=filters[business_id][equals]=${id}`,
              title: "لیست تراکنش ها",
            },
          ]);
        } else {
          showProps = [
            {
              state: "user_wallet_balance",
              title: "مجموع مبلغ کیف پول",
              type: "number",
              value: data.user_wallet_balance,
            },
            {
              state: "total_paid",
              title: "مجموع مبلغ پرداخت شده به کیف پول",
              type: "number",
              value: data.total_paid,
            },
            {
              state: "total_withdraw",
              title: "مجموع مبلغ برداشت شده از کیف پول",
              type: "number",
              value: data.total_withdraw,
            },
          ];

          setActions([
            {
              route: `/turnovers/users?page=1&filters=filters[user_id][equals]=${id}`,
              title: "لیست تراکنش ها",
            },
          ]);
        }

        setData(showProps);
        setIsLoading(false);
      }
    );
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);

    let body = {};
    if (businessType === "business")
      body = {
        business_id: id,
        amount: states?.amount,
        description: states?.description,
      };
    else {
      if (!states?.type?.key) {
        Notify({ type: "error", body: "نوع عملیات الزامی است" });
        setDisabled(false);
        return;
      }
      body = {
        user_id: id,
        amount: states?.amount,
        description: states?.description,
        type: states?.type?.key === "increase" ? "increase" : "decrease",
      };
    }

    console.log({ body });
    const prefix = businessType === "business" ? "businesses" : "users";

    ApiCall(
      "POST",
      `${endpoint}/${prefix}`,
      body,
      "SUBMIT CREATE",
      ({ data }) => {
        getReports();
        setDisabled(true);
        router.push(
          `/turnovers/${prefix}?page=1&filters=filters[${
            businessType === "business" ? "business_id" : "user_id"
          }][equals]=${id}`
        );
      },
      () => setDisabled(false)
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title="ثبت تراکنش"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      <ShowActions actions={actions} />

      <div className="my-10 mx-2">
        <Detail data={data} />
      </div>

      <Divider moreClass="dark:bg-slate-700 my-10"></Divider>

      {/* ********************** Form Builder *********************** */}
      <FormBuilder
        formItems={createForm(businessType)}
        states={states}
        setStates={setStates}
        notEditableList={notEditableList}
      />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default CreateTurnover;
