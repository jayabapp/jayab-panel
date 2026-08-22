"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import ListTable from "@/components/ListTable/ListTable.component";
import { Checkbox } from "@nextui-org/react";
import numberWithCommas from "@/helpers/NumberWithCommas";
import { Divider } from "@/components/shared/Divider";
import Notify from "@/components/shared/Toast";

type State = { [key: string]: any };

const endpoint = apiRoutes.SUBSCRIPTION1;

const SubscriptionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [refresher, setRefresher] = useState<number>(0);
  const [subPlans, setSubPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | undefined>();

  const [advisorId, setAdvisorId] = useState(Number(searchParams?.get("advisor_id")) || null);

  const [propertyId, setPropertyId] = useState(Number(searchParams?.get("property_id")) || null);

  useEffect(() => {
    getFormItems();
    getSubPlans();
  }, []);

  const getFormItems = () => {
    ApiCall("GET", `${endpoint}/model-props`, null, "GET FORM ITEMS", ({ data }) => {
      const props = data.createProps;
      setFormItems(props || []);
      setIsLoading(false);
    });
  };

  /* ------------------------------ GET SUB PLANS ----------------------------- */
  const getSubPlans = () => {
    ApiCall(
      "GET",
      apiRoutes.SUBSCRIPTION_PLANS1,
      { group: advisorId ? "ADVISOR" : "PROPERTY", page: 1 },
      "GET SUB PLANS ITEMS",
      ({ data }) => {
        setSubPlans(data.data);
      }
    );
  };

  /* ------------------------- GET CHAINED STATE LIST ------------------------- */
  // const getChainedStateList = (state: string, route: string) => {
  //   ApiCall("GET", route, null, "GET CHAINED", ({ data }) => {
  //     const nextState = produce(formItems, (draftState: CreateProps[]): any => {
  //       const index = draftState.findIndex((_) => _.state == state);
  //       if (index > -1) draftState[index]["selectItems"] = data;
  //       else formItems;
  //     });
  //     setFormItems(nextState);
  //   });
  // };

  //به ازای هر لیست وابسته یکبار این تابع نوشته می شود
  // useEffect(() => {
  //   if (states["category_id"])
  //     getChainedStateList("sub_category_id", `/admin/categories/parents/${states["category_id"]?.id}`);
  // }, [states["category_id"]]);

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    if (!selectedPlan || (!advisorId && !propertyId)) {
      setDisabled(false);

      return Notify({
        type: "warn",
        body: "مقادیر الزامی را انتخاب کنید",
      });
    }

    body = {
      subscription_plan_id: selectedPlan,
      advisor_id: advisorId,
      property_id: propertyId,
    };

    console.log({ body });

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
      ({ data }) => {
        // router.back();
        setRefresher(Math.random()); // to uncomment it, comment the router.back
        setDisabled(false);
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

      <div className="flex flex-col col-span-full gap-y-4 mt-8">
        {subPlans?.map((e: { id: number; title: string; price: number; duration: number }) => (
          <Checkbox
            key={e.id}
            onValueChange={(v: any) => (v ? setSelectedPlan(e.id) : setSelectedPlan(undefined))}
            isSelected={selectedPlan == e.id}
          >
            <p className="mr-2">
              <span className="text-warning-400">{e.title} </span>-<span className=""> {e.duration} روزه </span>-
              <span className="c"> {numberWithCommas(e.price)} تومان</span>
            </p>
          </Checkbox>
        ))}
      </div>

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} title="خرید" onPress={onSubmit} />

      {/*********************** Table ************************/}
      <div className="mt-40">
        <Divider></Divider>
        <ListTable
          endPointQuery={advisorId ? `?advisor_id${advisorId}` : `?property_id=${propertyId}`}
          showFilters={false}
          endpoint={endpoint}
          mustRefresh={refresher}
        />
      </div>
    </div>
  );
};

export default SubscriptionCreate;
