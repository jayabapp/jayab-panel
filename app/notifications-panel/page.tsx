"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { Button, Checkbox } from "@nextui-org/react";
import { PaginationMeta } from "@/interfaces/pagination.type";
import { isEmpty } from "lodash";
import { apiRoutes } from "@/utils/urls";
import Alert from "@/components/shared/Alert";
import { Notification } from "@/interfaces/schema.type";
import { Checks } from "@phosphor-icons/react";
import { useNotificationStore, useSettingStore } from "@/store";

const endpoint = apiRoutes.NOTIFICATIONS1;

const Notifications = ({}) => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const { notifBadge, newNotifRefresher } = useNotificationStore((s) => s);
  const { muteNotifSound } = useSettingStore((s) => s);

  useEffect(() => {
    getList();
  }, [newNotifRefresher]);

  /* -------------------------------- GET LIST -------------------------------- */
  const getList = () => {
    const body = { cursor: 0, per_page: 200 };

    ApiCall("GET", endpoint, body, "GET LIST", ({ data }) => {
      setList(data || []);
      useNotificationStore.setState({ notifBadge: data.length });
      setMeta(data.meta);
      setIsLoading(false);
    });
  };

  const seenAll = () => {
    ApiCall("PATCH", `${endpoint}/seen-all`, null, "seen all", () => {
      setList([]);
      useNotificationStore.setState({ notifBadge: 0 });
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="">
      {/*********************** PAGE HEADER ************************/}
      <PageHeader
        model={"model"}
        modelTitle={"اعلانـات"}
        hasCreateButton={false}
      >
        {!isEmpty(list) && (
          <Button
            variant="light"
            color="success"
            startContent={<Checks size={16} className="text-success" />}
            onPress={() => seenAll()}
          >
            همه را خواندم
          </Button>
        )}
        <Checkbox
          onValueChange={(v) => useSettingStore.setState({ muteNotifSound: v })}
          isSelected={muteNotifSound}
        >
          <span className="mr-2">{`بی صدا کردن`}</span>
        </Checkbox>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {list?.map((notif) => (
          <Alert
            key={notif.id}
            id={notif.id}
            notificationableId={notif.data?.event_id}
            notificationType={notif.data?.event_type}
            title={notif.title}
            body={notif.body}
            createdAt={notif.created_at}
            cb={getList}
          />
        ))}
      </div>
      {/*********************** FILTER ************************/}
    </div>
  );
};

export default Notifications;
