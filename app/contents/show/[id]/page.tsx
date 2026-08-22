"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";

import { Divider } from "@/components/shared/Divider";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { ShowAction, ShowProps } from "@/components/Table/table.type";
import Detail from "@/components/Show/Details";
import { apiRoutes } from "@/utils/urls";
import ShowActions from "@/components/Show/ShowActions";
import { ContentCategory, PrimitiveObject } from "@/interfaces/schema.type";
import { FormDivider } from "@/components/Form/FormDivider";

const endpoint = apiRoutes.CONTENT2;

const ContentShow = () => {
  const params = useParams();
  const { id } = params || {};

  const router = useRouter();
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ShowProps[]>([]);
  const [actions, setActions] = useState<ShowAction[]>([]);
  const [fields, setFields] = useState<PrimitiveObject>({});
  const [dynamicFields, setDynamicFields] = useState<ContentCategory>();
  const [seoData, setSeoData] = useState<PrimitiveObject>({});

  useEffect(() => {
    getData();
  }, []);

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = () => {
    ApiCall(
      "GET",
      `${endpoint}/${id}`,
      null,
      "GET DATA",
      (res: { data: { showProps: ShowProps[]; actions: ShowAction[] } }) => {
        setData(res.data?.showProps?.filter((e: any) => !e.isHidden));
        setFields((res.data.showProps?.find((e) => e.state == "fields")?.value as PrimitiveObject) || {});
        setDynamicFields(res.data.showProps?.find((e) => e.state == "category")?.value as ContentCategory);
        setActions(res.data?.actions || []);
        setSeoData((res.data.showProps?.find((e) => e.state == "seo")?.value as PrimitiveObject) || {});
        setIsLoading(false);
      }
    );
  };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="جــزییـات :" hasCreateButton={false} hasBackButton={true} />
      </div>

      {/*********************** ACTIONS ************************/}
      <ShowActions actions={actions} />

      {/*********************** DETAIL ************************/}
      <Detail data={data} />

      {Object.keys(fields)?.map((e, i) => (
        <div key={i} className="grid grid-cols-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 my-2 ">
          <p className="font-light text-teal-400">
            {dynamicFields?.["dynamic_fields"]?.find((_) => _.key == e)?.title}:
          </p>
          <p className="font-medium">{fields?.[e]}</p>
        </div>
      ))}

      <Divider moreClass="my-6" />
      <p className="font-bold text-lg">فیلدهای مربوط به SEO:</p>
      {Object.keys(seoData)?.map((e, i) => (
        <div key={i} className="grid grid-cols-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 my-2 ">
          <p className="font-light text-teal-400">{e}:</p>
          <p className="font-medium">{seoData?.[e]}</p>
        </div>
      ))}
    </div>
  );
};

export default ContentShow;
