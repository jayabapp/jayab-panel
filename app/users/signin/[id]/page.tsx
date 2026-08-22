"use client";

import Loading from "@/components/shared/Loading";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import { Button } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserSignin = () => {
  const params = useParams();
  const { id } = params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    ApiCall(
      "GET",
      `${apiRoutes.USER1}/${id}/sso`,
      null,
      "GET TOKEN",
      ({ data }) => {
        setToken(data);
        setIsLoading(false);
      },
    );
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <div className="fixed inset-0 z-50">
      <iframe
        src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}?sso_token=${token}`}
        className="h-full w-full"
        style={{ display: showIframe ? "block" : "none" }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-4 mx-auto flex justify-center">
        <Button
          color="danger"
          variant="shadow"
          className="pointer-events-auto"
          onPress={() => {
            window.close();
            setShowIframe(false);
          }}
        >
          خروج از حساب کاربر
        </Button>
      </div>
    </div>
  );
};

export default UserSignin;
