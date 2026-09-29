"use client";

import AdminSsoFrame from "@/components/shared/AdminSsoFrame";
import { apiRoutes } from "@/utils/urls";
import { useParams } from "next/navigation";

const UserSignin = () => {
  const params = useParams();
  const { id } = params || {};

  return (
    <AdminSsoFrame
      ssoUrl={`${apiRoutes.USER1}/${id}/sso`}
      exitLabel="خروج از حساب کاربر"
    />
  );
};

export default UserSignin;
