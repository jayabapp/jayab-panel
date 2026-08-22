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
import XMLViewer from "react-xml-viewer";

const Sitemap = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState<PrimitiveObject>({});
  const [disabled, setDisabled] = useState(false);
  const [sitemapText, setSitemapText] = useState("");

  useEffect(() => {
    getSitemap();
  }, []);

  const getSitemap = () => {
    ApiCall("GET", apiRoutes.SETTING3, null, "get sitemap", ({ data }: { data: string }) => {
      setSitemapText(data);
      setIsLoading(false);
    });
  };

  const onSubmit = () => {
    setDisabled(true);

    ApiCall(
      "POST",
      `${apiRoutes.SETTING1}/sitemap`,
      null,
      "update sitemap",
      ({ data }) => {
        setSitemapText(data);
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
        <PageHeader title={"سایت مپ"} hasCreateButton={false}>
          <Button onPress={onSubmit} isLoading={disabled} disabled={disabled} color="primary">
            به روزرسانی سایت مپ
          </Button>
        </PageHeader>
      </div>
      {/*********************** CONTENT ************************/}
      <div className="my-8 ltr bg-white p-4 rounded-10">
        <XMLViewer xml={sitemapText} />
      </div>
    </div>
  );
};

export default Sitemap;
