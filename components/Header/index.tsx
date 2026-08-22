"use client";

import React, { useEffect, useState } from "react";

import { DarkModeSwitch } from "react-toggle-dark-mode";
import { throttle } from "lodash";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import DrawerMenu from "./DrawerMenu";
import { ArrowRightIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { AuthStore, SettingStore, useAuthStore, useNotificationStore, useSettingStore, useSidebarStore } from "@/store";
import { BellSimple } from "@phosphor-icons/react";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { Button } from "@nextui-org/react";
import Notify from "../shared/Toast";
import axios from "axios";

const Header = ({}) => {
  const router = useRouter();
  let pathname = usePathname();
  const absolutePath = pathname.substring(1);
  const { theme, setTheme } = useTheme();
  const isSidebarOpen = useSidebarStore((state: any) => state.isSidebarOpen);
  const setting = useSettingStore((state: SettingStore) => state.setting);

  const [visibleTopHeader, setVisibleTopHeader] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { notifBadge, newNotifRefresher, unreadEmailCount } = useNotificationStore((s) => s);
  // const { unreadCount } = useChatStore((s) => s);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBadgeCount();
  }, [newNotifRefresher]);

  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);
    return () => window?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = throttle((event) => {
    if (window?.scrollY > 200) setVisibleTopHeader(false);
    else setVisibleTopHeader(true);
  }, 500);

  //برای جلوگیری از اسکرول صفحه اصلی وقتی دراور بازه
  useEffect(() => {
    if (isOpenDrawer) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up the effect when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpenDrawer]);

  const findBackAction = () => {
    switch (absolutePath) {
      default:
        router.back();
        break;
    }
  };

  const getBadgeCount = () => {
    ApiCall("GET", apiRoutes.NOTIFICATIONS1 + "/badge", null, "GET BADGE IN HEADER", ({ data }) => {
      useNotificationStore.setState({ notifBadge: data });
    });
  };

  const toggleDarkMode = () => {
    if (theme == "dark") {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  /**
   * با زدن این دکمه به صفحه مشخصی در سایت میرویم و اگر توکن ولید باشه سایت به حالت ادیت میرود
   * @returns
   */
  const _renderWebsiteEditButton = () => {
    const webUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
    if (!!webUrl)
      return (
        <a
          href={`${webUrl}/edit-mode?access_key=${localStorage.getItem("token")}`}
          target="_blank"
          referrerPolicy="no-referrer"
          className="px-3 py-2 rounded-10 bg-gradient-to-br from-teal-400 to-cyan-700 font-medium text-white text-xs lg:text-md"
        >
          ویرایش محتوای سایت
        </a>
      );
    else return <></>;
  };

  const websiteSsrCacheRevalidate = async () => {
    setIsLoading(true);

    try {
      const res = await axios({
        method: "GET",
        url: `/api/revalidate-ssr?token=${localStorage.getItem("token")}`,
      });
      setIsLoading(false);
      console.log(res);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`${visibleTopHeader ? "translate-y-0" : "-translate-y-full"} ${
          isSidebarOpen ? "lg:w-[calc(100vw-300px)]" : "lg:w-[calc(100vw-80px)]"
        } bg-white dark:bg-slate-800 transition-all ease-in-out duration-500  left-0 fixed top-0   app-size  shadow-lg lg:shadow-0 border-b-1  lg:backdrop-blur-0 lg:bg-opacity-100 dark:shadow-none  pb-2 lg:pb-4  border-gray-100 dark:border-slate-800 border-r-2 z-50 lg:z-10000`}
      >
        {/************************************************************ DESKTOP HEADER ************************************************************/}
        <div className="hidden w-full lg:flex flex-row items-center justify-between mt-4 px-4">
          <div className="flex justify-between items-center w-full   h-[48px] ">
            <div>
              <div className="mr-3">
                <img
                  src={setting?.APP_LOGO}
                  onClick={() => {
                    router.push("/");
                  }}
                  className="w-16 object-contain cursor-pointer"
                />
              </div>
            </div>

            {/******************************** HEADER ITEMS  ********************************/}

            <div className="hidden lg:flex gap-3 justify-center items-center">
              <Button
                color="danger"
                isLoading={isLoading}
                disabled={isLoading}
                size="sm"
                onPress={() => websiteSsrCacheRevalidate()}
              >
                پاک کردن کش سایت
              </Button>
              {_renderWebsiteEditButton()}
              <div className={""}>
                <ProfileDropdown />
              </div>
              <div className="relative cursor-pointer mx-2" onClick={() => router.push("/notifications-panel")}>
                <div
                  className="absolute left-3 -top-1.5 text-center text-white px-1.5 py-1 leading-3 text-sm rounded-full bg-danger"
                  style={{ minWidth: 16, display: !notifBadge ? "none" : "block" }}
                >
                  {notifBadge || 0}
                </div>
                <BellSimple className="w-6 h-6" />
              </div>
              {/* DARK MODE */}
              <div className="hidden lg:block">
                <DarkModeSwitch
                  checked={theme == "dark"}
                  onChange={toggleDarkMode}
                  size={26}
                  sunColor="#F9C97C"
                  moonColor="#06B7DB"
                />
              </div>
            </div>
          </div>
        </div>

        {/************************************************ MOBILE ROW 1  ************************************************/}
        <div className="px-2 lg:px-6 py-2 flex  lg:hidden justify-between items-center">
          <Bars3Icon
            className="w-6 h-auto object-contain block lg:hidden text-black dark:text-white"
            onClick={() => {
              setIsOpenDrawer((e) => !e);
            }}
          />
          <div className={"flex items-center"}>
            <ProfileDropdown />
          </div>
        </div>

        {/************************************************ MOBILE ROW 2  ************************************************/}
        <div className="flex justify-between lg:hidden items-center px-2 py-3 lg:px-6 lg:py-0 ">
          <div className="flex items-center  lg:hidden">
            {!["", "/", "#"].includes(absolutePath) && (
              <div className="mt-1 mx-1">
                <ArrowRightIcon className="w-6 text-black dark:text-white" onClick={() => findBackAction()} />
              </div>
            )}
            <h5 className="text-truncate text-end  mt-1 mx-3 font-bold"></h5>
          </div>
          <div className="flex items-center gap-2">
            <Button
              color="danger"
              isLoading={isLoading}
              disabled={isLoading}
              size="sm"
              onPress={() => websiteSsrCacheRevalidate()}
            >
              <p className="text-xs">پاک کردن کش سایت</p>
            </Button>
            {_renderWebsiteEditButton()}
            <div className="relative cursor-pointer mr-4" onClick={() => router.push("/notifications-panel")}>
              <div
                className="absolute left-3 -top-1.5 text-center text-white px-1.5 py-1 leading-3 text-sm rounded-full bg-danger"
                style={{ minWidth: 16, display: !notifBadge ? "none" : "block" }}
              >
                {notifBadge || 0}
              </div>
              <BellSimple className="w-6 h-6" />
            </div>

            <DarkModeSwitch
              checked={theme == "dark"}
              onChange={toggleDarkMode}
              size={24}
              sunColor="#F9C97C"
              moonColor="#06B7DB"
            />
          </div>
        </div>
      </div>
      <DrawerMenu isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer} />
    </>
  );
};

export default React.memo(Header);
