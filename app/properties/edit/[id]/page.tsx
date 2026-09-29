"use client";

import AdminSsoFrame from "@/components/shared/AdminSsoFrame";
import { apiRoutes } from "@/utils/urls";
import { useParams } from "next/navigation";

const PropertyEdit = () => {
  const params = useParams();
  const { id } = params || {};

  return (
    <AdminSsoFrame
      ssoUrl={`${apiRoutes.PROPERTY1}/${id}/sso`}
      redirectPath={`|profile|owner|properties|${id}`}
      exitLabel="خروج از حالت ویرایش"
    />
  );
};

export default PropertyEdit;
