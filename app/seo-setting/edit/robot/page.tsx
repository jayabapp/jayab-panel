"use client";

import { useEffect, useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import Notify from "@/components/shared/Toast";
import { p2e } from "@/helpers/p2e";
import Loading from "@/components/shared/Loading";
import FormInput from "@/components/Form/FormInput";
import PageHeader from "@/components/Table/PageHeader";
import { PrimitiveObject, Setting, SettingDataType } from "@/interfaces/schema.type";
import { Button } from "@nextui-org/react";
import FormInputMulti from "@/components/Form/FormInputMulti";

const SEOSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState<PrimitiveObject>({});
  const [disabled, setDisabled] = useState(false);
  const [robotTxt, setRobotTxt] = useState("");

  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = () => {
    ApiCall("GET", apiRoutes.SETTING2, null, "get robot", ({ data }: { data: string }) => {
      setRobotTxt(data);
      setIsLoading(false);
    });
  };

  const onSubmit = () => {
    setDisabled(true);
    const body = {
      robot_text: robotTxt,
    };

    console.log(body);

    ApiCall(
      "POST",
      `${apiRoutes.SETTING1}/robot`,
      body,
      "update robot",
      ({ data }) => {
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="app-container-profile">
      {/*********************** PAGE HEADER ************************/}
      <div>
        <PageHeader title={"تنظیمات"} hasCreateButton={false} />
      </div>
      {/*********************** CONTENT ************************/}
      <div className="my-8">
        <FormInputMulti
          title="محتوای فایل ربات"
          options={{ rows: 10, inputClass: "ltr text-en !leading-8" }}
          value={robotTxt}
          onChangeText={(v) => setRobotTxt(v)}
        />
        <Button
          onPress={onSubmit}
          isLoading={disabled}
          disabled={disabled}
          color="primary"
          // variant="shadow"
        >
          ثبت
        </Button>
      </div>
    </div>
  );
};

export default SEOSetting;
