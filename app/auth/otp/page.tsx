"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import OtpInput from "@/components/Auth/OtpInput";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import {
  AuthStore,
  B2CConfig,
  SettingStore,
  useAuthStore,
  useSettingStore,
} from "@/store";
import { rbacSidebarItems } from "@/components/Sidebar/rbacSidebarItems";
import { sidebarRowItems } from "@/components/Sidebar/SidebarRowItems";
import Lottie from "react-lottie";
import lottieAnimation from "@/public/assets/lotties/otp.json";
const LottieComponent = Lottie as React.ComponentType<any>;

const OtpPage = () => {
  const router = useRouter();
  const [code, setCode] = useState();
  const [disable, setDisable] = useState(false);
  const searchParams = useSearchParams();
  const sigininToken = searchParams.get("token");

  const setSettings = useSettingStore(
    (state: SettingStore) => state.setSetting,
  );
  const setAdminInfo = useAuthStore((state: AuthStore) => state.setAdminInfo);
  const setting = useSettingStore((state: SettingStore) => state.setting);
  const setSidebar = useSettingStore((state: SettingStore) => state.setSidebar);
  const setAdminAccess = useAuthStore(
    (state: AuthStore) => state.setAdminAccess,
  );

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [onSubmit]);

  const _onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Enter") onSubmit();
    else return false;
  };

  function onSubmit() {
    if (!sigininToken) {
      Notify({
        type: "error",
        title: "خطای ورود",
        body: "لطفا دوباره وارد شوید",
      });
      router.replace("/auth");
      return;
    }
    setDisable(true);
    const body = {
      code,
    };
    ApiCall(
      "POST",
      apiRoutes.AU2,
      body,
      "VERIFY OTP CODE",
      ({ data }) => {
        localStorage.setItem("token", data.tokens.token);
        localStorage.setItem("socket_token", data.tokens.socket_token);

        const adminInfo = data?.admin || {};
        delete adminInfo.password;

        setAdminInfo(adminInfo);
        getInit();
      },
      (err) => {
        // console.log({ e: err?.response?.data });
        // if (err?.response?.data?.message_code == "ADMIN_AUTH3") router.replace("/auth");
        setDisable(false);
      },
      { token: sigininToken },
    );
  }

  const getInit = () => {
    ApiCall("GET", apiRoutes.INIT1, null, "INIT", ({ data }) => {
      setSettings(data);
      getAdminRBAC(data);
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
        router.push("/");
      },
      void null,
      {},
      false,
    );
  };

  return (
    <div className="auth-container !overflow-hidden">
      <div className="auth-form-section">
        <div className="w-9/10 mx-auto flex  flex-col justify-between  lg:mt-3   ">
          <div className="mx-8">
            <div className="flex flex-col justify-center mt-8 lg:mt-4 md:mt-2   !overflow-hidden">
              <div
                className="flex items-center self-end  w-fit px-4 py-2 rounded-6  bg-gray-100 dark:bg-slate-600 cursor-pointer mb-4"
                onClick={() => {
                  router.replace("/auth");
                }}
              >
                <p className="ml-2">بازگشت به صفحه قبل</p>
                <ArrowLeftCircleIcon className="w-8 h-8 text-gray-400 dark:text-white cursor-pointer " />
              </div>
              <div className="flex  flex-col">
                <div className="flex justify-center items-center">
                  <img
                    src={setting?.APP_LOGO}
                    className="w-36 h-36 object-contain"
                  />
                </div>

                <div className="mt-8">
                  <p className="  font-medium mb-3 text-[1rem]  ">
                    {"کد 5 رقمی ارسال شده به شماره همراه خود را وارد کنید"}
                  </p>
                </div>
              </div>
              <div className="mt-6 mx-auto">
                <OtpInput setValue={setCode} />
              </div>
            </div>
          </div>

          <div className="mb-4 mt-16 mx-8">
            <Button
              title={"ورود"}
              onClick={() => onSubmit()}
              width="w-full mx-auto "
              disabled={disable}
              loading={disable}
              size="md"
            />
          </div>
        </div>
      </div>

      <div className="auth-image-section ">
        {/* <img src="/assets/images/auth.png" className=" object-contain rounded-l-10 h-[400px]" /> */}
        <LottieComponent
          width={240}
          height={240}
          options={{ animationData: lottieAnimation, loop: true }}
        />
      </div>
    </div>
  );
};

export default OtpPage;
