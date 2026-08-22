"use client";
import { useState, useEffect } from "react";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { useParams, useRouter } from "next/navigation";
import PermissionTable from "@/components/RbacTable";
import { InboxArrowDownIcon } from "@heroicons/react/24/solid";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { Button } from "@nextui-org/react";
import SubmitButton from "@/components/Form/SubmitButton";
import { AccessControlList, AccessControlModule } from "@/interfaces/schema.type";

const PermissionsPage = () => {
  const params = useParams();
  const id = params?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<AccessControlModule[]>([]);
  const [permissions, setPermissions] = useState<AccessControlList[]>([]);

  useEffect(() => {
    getModules();
  }, []);

  /* -------------------------------- GET ROLE MODULES PERMISSIONS ------------------------------- */
  const getModules = () => {
    setIsLoading(true);
    ApiCall("GET", apiRoutes.ACL_MODULES, null, "MODULES GET", ({ data }) => {
      setModules(data);
      getPermissions(data);
    });
  };

  const getPermissions = (permissionList: AccessControlList[]) => {
    ApiCall("POST", apiRoutes.ACL_ROLE_PERMISSIONS(+id), null, "PERMISSIONS GET", ({ data }) => {
      let rbac: AccessControlList[] = [];
      for (const item of permissionList) {
        console.log({ item });

        const mod: AccessControlList = data?.find((e: AccessControlList) => e?.module_id === item.id);

        if (!mod) continue;

        rbac.push({
          id: item.id,
          module_id: item.id || 1,
          c: mod.c,
          r: mod.r,
          u: mod.u,
          d: mod.d,
          v: mod.v,
          all: mod.c && mod.r && mod.u && mod.d && mod.v,
        });
      }
      setPermissions(rbac);
      setIsLoading(false);
    });
  };

  /* -------------------------------- UPDATE ROLE MODULES PERMISSIONS ------------------------------- */
  const createRBAClist = () => {
    setIsLoading(true);
    let body = {
      role_id: id,
      list: permissions,
    };

    ApiCall("POST", apiRoutes.ACL_CREATE_RBAC, body, "RBAC UPDATE", ({ data }) => {
      getModules();
      setIsLoading(false);
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="دسترسی های نقش" hasBackButton hasCreateButton={false} />
      </div>
      {/*********************** TABLE ************************/}
      <div className="my-8">
        <PermissionTable modules={modules} permissions={permissions} setPermissions={setPermissions} />
      </div>
      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={isLoading} onPress={() => createRBAClist()} />
    </div>
  );
};

export default PermissionsPage;
