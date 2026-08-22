"use client";

import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import Loading from "@/components/shared/Loading";
import { DashboardElement } from "@/interfaces/schema.type";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Alert from "@/components/shared/Alert";
import { SocketStore, useAuthStore, useSocketStore } from "@/store";
import { isEmpty } from "lodash";

/* -------------------------------------------------------------------------- */
/* DISABLE CONSOLE LOG IN PRODUCTION */
/* -------------------------------------------------------------------------- */
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}
/* -------------------------------------------------------------------------- */
/* END DISABLE CONSOLE LOG IN PRODUCTION */
/* -------------------------------------------------------------------------- */

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [elements, setElements] = useState<DashboardElement[]>([]);
  const { alerts, setAlerts } = useSocketStore((state: SocketStore) => state);

  const adminInfo = useAuthStore((state) => state.adminInfo);

  const firstRender = useRef(true);

  useEffect(() => {
    getDashboardElements();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    getDashboardElements();
  }, [alerts]);

  const getDashboardElements = () => {
    const route = adminInfo?.business_id
      ? apiRoutes.DASHBOARD2
      : apiRoutes.DASHBOARD1;
    ApiCall("GET", route, null, `GET DASHBOARD`, ({ data }) => {
      setElements(data);
      setIsLoading(false);
    });
  };
  if (isLoading) return <Loading />;
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {elements?.map((e) => {
          if (e.type == "divider")
            return (
              <div
                key={e.id}
                className="flex items-center gap-4 col-span-full my-4"
              >
                <p className="font-bold shrink-0 text-xl opacity-90">
                  {e.title}
                </p>
                <div className="h-[1px]  bg-gray-200 dark:bg-slate-700 w-full" />
              </div>
            );
          else
            return (
              <div
                key={e.id}
                className={`rounded-10 py-3 px-3 text-black dark:text-white border border-gray-400 dark:border-slate-600 border-dashed polka-pattern dark:polka-pattern-dark`}
              >
                {/* <img src="/assets/icons/duotone-pack/person.png" className="w-10 ml-2" /> */}
                <div className="flex items-center justify-between ">
                  <p className="font-bold text-md">{e.title}</p>
                  <p className="text-2xl font-bold text-teal-400 text-left">
                    {+e.value}
                  </p>
                </div>
                <p
                  className={`font-light text-sm  ${
                    !e.sub_title ? "opacity-0" : "opacity-70"
                  }`}
                >
                  {e.sub_title || "-"}
                </p>

                <ArrowLeftCircleIcon
                  className={`w-8 float-left text-warning cursor-pointer ${
                    e.route ? "opacity-100" : "opacity-0"
                  }`}
                  onClick={() => {
                    if (!e.route) return;
                    router.push(e.route);
                  }}
                />
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
