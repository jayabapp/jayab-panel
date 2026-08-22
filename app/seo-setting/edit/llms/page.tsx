"use client";

import { useEffect, useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { Button } from "@nextui-org/react";
import FormInputMulti from "@/components/Form/FormInputMulti";

const LlmsSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [llmsTxt, setLlmsTxt] = useState("");

  useEffect(() => {
    getLlms();
  }, []);

  const getLlms = () => {
    ApiCall("GET", apiRoutes.SETTING4, null, "get llms", ({ data }: { data: string }) => {
      setLlmsTxt(data);
      setIsLoading(false);
    });
  };

  const onSubmit = () => {
    setDisabled(true);

    ApiCall(
      "POST",
      `${apiRoutes.SETTING1}/llms`,
      { llms_text: llmsTxt },
      "update llms",
      () => {
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="app-container-profile">
      <div>
        <PageHeader title={"تنظیمات"} hasCreateButton={false} />
      </div>
      <div className="my-8">
        <FormInputMulti
          title="محتوای فایل llms"
          options={{ rows: 10, inputClass: "ltr text-en !leading-8" }}
          value={llmsTxt}
          onChangeText={(v) => setLlmsTxt(v)}
        />
        <Button onPress={onSubmit} isLoading={disabled} disabled={disabled} color="primary">
          ثبت
        </Button>
      </div>
    </div>
  );
};

export default LlmsSetting;
