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

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<PrimitiveObject>({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = () => {
    ApiCall("GET", apiRoutes.SETTING1, null, "get settings", ({ data }: { data: Setting[] }) => {
      setSettings(data);
      let f = {};
      data.map((_) => {
        f = { ...f, [_.key]: `${_.value}` };
      });
      setValues(f);
      setIsLoading(false);
    });
  };

  const onChangeText = (key: string, value: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const onSubmit = (id: number) => {
    const s = settings.find((e) => e.id == id);
    if (!s) return;
    const value = values[s.key];
    const enStringValue = p2e(value);

    if (s.data_type == SettingDataType.NUMBER) {
      const enValue = Number(enStringValue) ?? 0; //برای موقعی که مقداری رو که نیاز نیست بخواهیم پاک کنیم
      if (isNaN(enValue)) return Notify({ type: "error", body: "مقدار وارد شده صحیح نیست" });
      if (enValue < 0) return Notify({ type: "error", body: "مقدار وارد شده صحیح نیست" });
      if (s.min && s.max && (+value < s.min || +value > s.max))
        return Notify({ type: "error", body: "مقدار وارد شده خارج از محدوده قابل قبول است" });
    }
    setDisabled(true);
    const body = {
      value: enStringValue || "0",
    };
    console.log(body);
    ApiCall(
      "PATCH",
      `${apiRoutes.SETTING1}/${id}`,
      body,
      "update settings",
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
        <div className="divide-y divide divide-dashed divide-gray-200 dark:divide-slate-600">
          {settings?.map((e) => (
            <div key={e.id} className="grid grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-4 w-full items-center py-3">
              <FormInput
                title={e.title}
                options={{
                  containerClass: "col-span-2 max-w-lg",
                  keyboard: e.data_type == SettingDataType.NUMBER ? "number" : "text",
                }}
                value={values[e.key]}
                onChangeText={(v) => onChangeText(e.key, v)}
                showX={false}
              />
              <div className="col-span-2 flex justify-center">
                <p className="text-sm font-bold  w-fit   text-danger bg-danger/10 text-center rounded-20 px-2 py-1">{`مقدار فعلی: ${e.value?.substring(
                  0,
                  20
                )}`}</p>
              </div>
              <p className="text-center">{e.min !== null ? `کمینه: ${e.min}` : ""}</p>
              <p className="text-center">{e.max ? `بیشینه: ${e.max}` : ""}</p>
              <Button
                onPress={() => onSubmit(e.id)}
                isLoading={disabled}
                disabled={disabled}
                color="primary"
                // variant="shadow"
              >
                ثبت
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
