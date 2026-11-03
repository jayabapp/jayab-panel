"use client";

import { useEffect, useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import Loading from "@/components/shared/Loading";
import { Button } from "@nextui-org/react";

type AdminSsoFrameProps = {
  ssoUrl: string;
  /** Pipe-delimited deep link inside the impersonated session, e.g. `|profile|owner|properties|123` */
  redirectPath?: string;
  exitLabel: string;
};

type SsoState = "loading" | "ready" | "error";

// Shared by the user sign-in and property-edit impersonation pages
// (FEATURE.md §8: "یک helper مشترک URL و session") — previously duplicated
// almost verbatim in both, including the missing error path: without
// `onError` here, a failed SSO request (e.g. an owner/advisor relation with
// missing data on an old account) left the page spinning forever instead of
// showing a real error.
const AdminSsoFrame = ({ ssoUrl, redirectPath, exitLabel }: AdminSsoFrameProps) => {
  const [state, setState] = useState<SsoState>("loading");
  const [token, setToken] = useState("");
  const [showIframe, setShowIframe] = useState(true);

  useEffect(() => {
    setState("loading");
    ApiCall(
      "GET",
      ssoUrl,
      null,
      "GET TOKEN",
      ({ data }) => {
        setToken(data);
        setState("ready");
      },
      () => setState("error"),
    );
  }, [ssoUrl]);

  if (state === "loading") return <Loading />;

  if (state === "error")
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white p-6 text-center">
        <p className="text-danger-500">
          ورود به حساب این کاربر ممکن نشد. ممکن است اطلاعات مالک یا مشاور این
          حساب ناقص باشد؛ با تیم فنی هماهنگ کنید.
        </p>
        <Button color="danger" variant="shadow" onPress={() => window.close()}>
          بازگشت
        </Button>
      </div>
    );

  const src = `${process.env.NEXT_PUBLIC_WEBSITE_URL}?sso_token=${token}${
    redirectPath ? `&__next=${redirectPath}` : ""
  }`;

  return (
    <div className="fixed inset-0 z-50">
      <iframe
        src={src}
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
          {exitLabel}
        </Button>
      </div>
    </div>
  );
};

export default AdminSsoFrame;
