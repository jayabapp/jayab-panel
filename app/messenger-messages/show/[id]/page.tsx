"use client";
import Loading from "@/components/shared/Loading";
import Detail from "@/components/Show/Details";
import ShowActions from "@/components/Show/ShowActions";
import PageHeader from "@/components/Table/PageHeader";
import { ShowAction, ShowProps } from "@/components/Table/table.type";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const endpoint = apiRoutes.MESSENGER_MESSAGES1;

const MessengerMessageShow = () => {
  const params = useParams();
  const { id } = params || {};

  const router = useRouter();
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ShowProps[]>([]);
  const [actions, setActions] = useState<ShowAction[]>([]);

  const [allShowProps, setAllShowProps] = useState<ShowProps[]>([]);

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
        setAllShowProps(res.data.showProps);

        setData(res.data?.showProps?.filter((e: any) => !e.isHidden));
        setActions(res.data?.actions || []);
        setIsLoading(false);
      }
    );
  };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title="جــزییـات :"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      {/*********************** CHANGE STATUS ************************/}
      {/* <ChangeStatus
        showProps={allShowProps}
        endpoint={`${endpoint}/${id}`}
        hideCondition={[10]}
        onUpdate={() => getData()}
      /> */}

      {/*********************** ACTIONS ************************/}
      <ShowActions actions={actions} />

      {/*********************** DETAIL ************************/}
      <Detail data={data} />
    </div>
  );
};

export default MessengerMessageShow;
