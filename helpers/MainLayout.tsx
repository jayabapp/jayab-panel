"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "../styles/global.css";

import { useRouter, usePathname } from "next/navigation";
import Loading from "@/components/shared/Loading";
const pkg = require("../package.json");

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  AuthStore,
  B2CConfig,
  SettingStore,
  useAuthStore,
  useSettingStore,
  useSidebarStore,
} from "@/store";
import { ApiCall } from "./ApiCall";
import { apiRoutes } from "@/utils/urls";

import Lottie from "react-lottie";
import lottieAnimation from "@/public/assets/lotties/loading.json";
const LottieComponent = Lottie as React.ComponentType<any>;

import { SocketIO } from "./SocketIO";
import { rbacSidebarItems } from "@/components/Sidebar/rbacSidebarItems";
import { sidebarRowItems } from "@/components/Sidebar/SidebarRowItems";
import { CheckRBAC } from "@/components/Sidebar/check-rbac";

const headerBlacklist = ["/auth", "/auth/otp", "/403"];

const authScreen = ["/auth", "/auth/otp"];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  //zustand
  const isSidebarOpen = useSidebarStore((state: any) => state.isSidebarOpen);
  const setSettings = useSettingStore(
    (state: SettingStore) => state.setSetting,
  );
  const setSidebar = useSettingStore((state: SettingStore) => state.setSidebar);
  const setAdminAccess = useAuthStore(
    (state: AuthStore) => state.setAdminAccess,
  );
  const setAdminInfo = useAuthStore((state: AuthStore) => state.setAdminInfo);

  const path = usePathname();
  const router = useRouter();

  const [minHeight, setminHeight] = useState(0);
  const [accessChecked, setAccessChecked] = useState(false);

  CheckRBAC();

  useEffect(() => {
    window.addEventListener("offline", () => setIsOnline(false));
    window.addEventListener("online", () => setIsOnline(true));
  }, []);

  useEffect(() => {
    setminHeight(window?.innerHeight);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || null;
    const authStorage = localStorage.getItem("auth-storage") || null;
    const adminInfo = authStorage
      ? JSON.parse(authStorage)?.state?.adminInfo
      : null;

    let timer: any;
    if (!token || token === "" || !adminInfo) {
      // getInit(false);
      router.push("/auth");
    } else {
      getInit(true);
    }
    timer = setTimeout(() => {
      setAccessChecked(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  SocketIO();

  const getInit = (authorized: boolean) => {
    ApiCall("GET", apiRoutes.INIT1, null, "INIT", ({ data }) => {
      setSettings(data);
      if (authorized) getAdminRBAC(data);
      // else router.push("/auth");
    });
  };

  const getAdminRBAC = (settings: B2CConfig) => {
    ApiCall(
      "GET",
      apiRoutes?.ADMIN_RBAC_LIST,
      null,
      "GET RBAC LIST",
      ({ data }) => {
        const filteredItems = rbacSidebarItems(
          sidebarRowItems(settings),
          data.rbac,
        );
        setAdminAccess(data.rbac);
        setAdminInfo(data.admin);
        setSidebar(filteredItems);
      },
      void null,
      {},
      false,
    );
  };

  if (!isOnline)
    return (
      <div className="h-screen w-screen bg-zinc-800 bg-gradient-to-bl from-[#02B2FB] to-[#01E9FD] flex flex-col justify-start items-center mx-auto pt-24">
        <img
          src="/assets/icons/no-signal.svg"
          width={100}
          height={100}
          alt=""
          className="animate-pulse"
        />
        <div className="text-white text-sm font-bold opacity-80 text-center mt-6">
          لطفا اتصال اینترنت خود را بررسی نمایید
        </div>
      </div>
    );

  if (!accessChecked)
    return (
      <div className="w-screen h-screen  flex flex-col justify-center items-center bg-white">
        {/* <img src="/assets/icons/logo/logo.png" className="w-40 h-40 object-contain -mb-10" alt="" /> */}
        {/* <img src={setting?.APP_LOGO} className="w-40 h-40 object-contain -mb-10" alt="" /> */}
        <LottieComponent
          width={300}
          height={300}
          options={{ animationData: lottieAnimation, loop: true }}
        />
        <div className="-mt-28 z-10">
          <Loading />
          <p className="text-gray-400 px-2 py-1 rounded-4 text-sm absolute bottom-3 mx-auto text-en bg-gray-100">
            ver {pkg.version}
          </p>
        </div>
      </div>
    );

  return (
    <div className="">
      <div className="app-size overflow-hidden   " style={{ minHeight }}>
        {!headerBlacklist.includes(path) && <Header />}
        {!authScreen.includes(path) ? (
          <div className="lg:grid grid-cols-12 w-full mx-auto gap-3   ">
            <div
              className={`transition-all hidden lg:block fixed overflow-scroll text-center h-full md:shadow-card-md  shadow-lg ${
                isSidebarOpen ? "w-[300px]" : "w-[80px]"
              }`}
            >
              <Sidebar />
            </div>
            <div
              className={`w-full col-span-12 mx-auto h-full pt-32 pb-40 px-4 ${
                isSidebarOpen ? "lg:pr-[320px]" : "lg:pr-[100px]"
              }  lg:pl-[2rem]`}
            >
              {children}
            </div>
          </div>
        ) : (
          //HEADER BLACK LIST
          <div className="h-full overflow-scroll"> {children}</div>
        )}

        <Toaster />
      </div>
    </div>
  );
};
export default MainLayout;
