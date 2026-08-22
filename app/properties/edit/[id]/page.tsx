"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { Button } from "@nextui-org/react";

type State = { [key: string]: any };

const PropertyEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [showIframe, setShowIframe] = useState(true);

  useEffect(() => {
    getToken();
  }, []);
  const getToken = () => {
    ApiCall("GET", `${apiRoutes.PROPERTY1}/${id}/sso`, null, "GET TOKEN", ({ data }) => {
      setToken(data);
      setIsLoading(false);
    });
  };

  if (isLoading) return <Loading />;
  return (
    <div className="fixed inset-0 z-50">
      <iframe
        src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}?sso_token=${token}&__next=|profile|owner|properties|${id}`}
        className="w-full h-full"
        style={{ display: showIframe ? "block" : "none" }}
      ></iframe>
      <div className="absolute top-4 left-0 right-0 mx-auto flex justify-center">
        <Button
          color="danger"
          variant="shadow"
          onPress={() => {
            window.close();
            setShowIframe(false);
          }}
        >
          خروج از حالت ویرایش
        </Button>
      </div>
    </div>
  );
};

export default PropertyEdit;
