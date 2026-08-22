"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import AuthInput from "@/components/Auth/AuthInput";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import Lottie from "react-lottie";
import lottieAnimation from "@/public/assets/lotties/auth.json";
const LottieComponent = Lottie as React.ComponentType<any>;

import { SettingStore, useSettingStore } from "@/store";

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(false);
  const setting = useSettingStore((state: SettingStore) => state.setting);

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [onSubmit]);

  function _onKeyDown(e: KeyboardEvent) {
    if (e.code == "Enter") onSubmit();
  }

  function onSubmit() {
    if (!username || !password)
      return Notify({
        type: "warn",
        body: "لطفا نام کاربری و رمز عبور را وارد نمایید",
      });

    setDisable(true);
    const body = {
      username,
      password,
    };
    ApiCall(
      "POST",
      apiRoutes.AU1,
      body,
      "LOGIN VIA USERNAME AND PASSWORD",

      (res) => {
        router.push(`/auth/otp?token=${res.data?.signin_token}`);
        setDisable(false);
      },
      (err) => {
        setDisable(false);
      },
    );
  }

  return (
    <div className="auth-container !overflow-hidden  ">
      <div className="auth-form-section border">
        <div className="w-9/10 mx-auto flex  h-full flex-col justify-between md:block  lg:mt-3  ">
          <div className="mx-8">
            <div className="flex flex-col justify-center mt-8 ">
              <div className="flex  flex-col">
                <div className="flex justify-center">
                  <img
                    src={setting?.APP_LOGO}
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <div className="mt-8">
                  <p className="  font-medium mb-3 text-[2rem]">
                    {"خوش آمدید"}
                  </p>
                  <p className="  font-medium mb-3 text-[1rem]  ">
                    {
                      "برای ارسال کد تایید، نام کاربری و رمز عبور خود را وارد کنید"
                    }
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <AuthInput
                  item={{
                    containerClass: "w-full",
                    placeholder: "نام کاربری",
                    isPassword: false,
                  }}
                  onChangeText={setUsername}
                  value={username}
                />
              </div>

              <div className="mt-3 ">
                <AuthInput
                  item={{
                    containerClass: "w-full ",
                    title: "رمز عبور",
                    isPassword: true,
                  }}
                  onChangeText={setPassword}
                  value={password}
                />
              </div>
            </div>
          </div>

          <div className="mb-96 lg:mb-4 mt-3 mx-8">
            <Button
              title={"ارسال کد تایید"}
              onClick={() => onSubmit()}
              width="w-full mx-auto "
              disabled={disable}
              loading={disable}
              size="md"
              //   variant="auth"
            />
          </div>
        </div>
      </div>

      <div className="auth-image-section">
        {/* <img src="/assets/images/auth.png" className=" object-contain rounded-l-10 h-[400px]" /> */}
        <LottieComponent
          width={300}
          height={300}
          options={{ animationData: lottieAnimation, loop: true }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
