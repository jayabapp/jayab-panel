import React, { ReactNode, useEffect, useState } from "react";
import { errorIcon, successIcon, warningIcon, infoIcon } from "../Toast/icons";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import moment from "moment-jalaali";

export enum NotificationType {
  NEW_TICKET = "NewTicket",
  NEW_USER_ACCOUNT = "NewUserAccount",
  NEW_ADVISOR_ACCOUNT = "NewAdvisorAccount",
  NEW_OWNER_ACCOUNT = "NewOwnerAccount",
  NEW_PROPERTY_AUTH = "NewPropertyAuth",
  NEW_PROPERTY_BADGE = "NewPropertyBadge",
  OWNER_PROPERTY = "OwnerProperty",
  ADVISOR_SUBSCRIPTION = "AdvisorSubscription",
}

export type Alert = {
  id: number;
  notificationableId: number;
  notificationType: NotificationType;
  title: string;
  type?: "success" | "error" | "warn" | "info";
  body?: string;
  createdAt: Date;
  cb?: () => void | null;
  children?: ReactNode;
};

const Alert = (props: Alert) => {
  const {
    id,
    notificationableId,
    type = "info",
    title,
    body,
    cb,
    notificationType,
    createdAt,
  } = props || {};
  const router = useRouter();
  const [route, setRoute] = useState("");

  useEffect(() => {
    _findRoute();
  }, []);

  const _findTypeData = () => {
    switch (type) {
      case "success":
        return { icon: successIcon, border: "border-r-green-500" };
      case "error":
        return { icon: errorIcon, border: "border-r-rose-500" };
      case "warn":
        return { icon: warningIcon, border: "border-r-yellow-400" };
      case "info":
        return { icon: infoIcon, border: "border-r-sky-400" };

      default:
        return { icon: infoIcon, border: "border-r-sky-400" };
    }
  };

  const _findRoute = (): void => {
    let r = "";
    switch (notificationType) {
      case NotificationType.NEW_TICKET:
        r = `/tickets/show/${notificationableId}`;
        break;
      case NotificationType.NEW_USER_ACCOUNT:
        r = `/users/edit/${notificationableId}`;
        break;
      case NotificationType.NEW_ADVISOR_ACCOUNT:
        r = `/advisors/show/${notificationableId}`;
        break;
      case NotificationType.NEW_OWNER_ACCOUNT:
        r = `/owners/show/${notificationableId}`;
        break;
      case NotificationType.NEW_PROPERTY_AUTH:
        r = `/property-authorize/show/${notificationableId}`;
        break;
      case NotificationType.NEW_PROPERTY_BADGE:
        r = `/property-badges/show/${notificationableId}`;
        break;
      case NotificationType.OWNER_PROPERTY:
        r = `/properties/show/${notificationableId}`;
        break;
    }
    setRoute(r);
  };

  const updateSeen = (refreshList: boolean) => {
    ApiCall(
      "PATCH",
      apiRoutes.NOTIFICATIONS2(id),
      null,
      "SEEN AT NOTIF",
      () => {
        if (!refreshList) router.push(route);
        else if (typeof cb === "function") cb();
      }
    );
  };
  return (
    <div
      className={`flex justify-between gap-4 relative w-full items-center bg-white  dark:bg-slate-700 rounded-lg px-3 py-3 text-black mx-auto  border border-gray-100 dark:border-0 
                border-r-8 dark:border-r-8 ${_findTypeData().border} shadow-lg
                transform-gpu translate-y-0 hover:translate-y-1  relative transition-all duration-500 ease-in-out 
                `}
    >
      <div className="flex justify-start items-center">
        {_findTypeData().icon}
        <div className="mr-1 app-text">
          <h1 className="font-bold text-md mx-2">{title}</h1>
          <p className="!text-right font-light w-full text-[13px] mx-2 leading-5 line-clamp-1">
            {body}
          </p>
          <p className="font-light text-xs leading-3 ltr text-right mr-2 mt-3 opacity-70">
            {moment(createdAt).format("jYYYY/jMM/jDD HH:mm")}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <XCircleIcon
          className="w-8 text-gray-300 dark:text-slate-400 cursor-pointer"
          onClick={() => updateSeen(true)}
        />

        <ArrowLeftCircleIcon
          className={`w-8 text-warning cursor-pointer ${
            !route ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => {
            if (!!route) updateSeen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Alert;
