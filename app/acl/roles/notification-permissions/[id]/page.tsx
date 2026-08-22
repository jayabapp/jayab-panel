"use client";
import { useState, useEffect } from "react";
import { apiRoutes } from "@/utils/urls";
import { ApiCall } from "@/helpers/ApiCall";
import { useParams, useRouter } from "next/navigation";
import PermissionTable from "@/components/RbacTable";
import { InboxArrowDownIcon } from "@heroicons/react/24/solid";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { Button, Checkbox } from "@nextui-org/react";
import SubmitButton from "@/components/Form/SubmitButton";
import {
  AccessControlList,
  AccessControlModule,
} from "@/interfaces/schema.type";

const NotificationPermissionsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [selectableItems, setSelectableItems] = useState([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getNotifList();
  }, []);

  /* -------------------------------- GET ROLE MODULES PERMISSIONS ------------------------------- */
  const getNotifList = () => {
    setIsLoading(true);
    ApiCall(
      "GET",
      `${apiRoutes.ACL_ROLE_NOTIF_PERMISSION1}/${id}/`,
      null,
      "GET SELECTABLE",
      ({ data }) => {
        setSelectableItems(data.selectable_items);
        if (data.permissions)
          setPermissions(data.permissions.substring(1).split("-") || []); //remove first dash
        setIsLoading(false);
      }
    );
  };

  const handleCheckbox = (value: string) => {
    let newPermission: Array<string> = [];
    if (permissions.includes(value))
      newPermission = permissions.filter((e) => e != value);
    else newPermission = permissions.concat(value);
    setPermissions(newPermission);
  };

  /* -------------------------------- UPDATE ROLE NOTIF PERMISSIONS ------------------------------- */
  const onSubmit = () => {
    setDisabled(true);
    let body = {
      role_id: +id,
      permissions: permissions.length > 0 ? `-${permissions.join("-")}` : "",
    };
    ApiCall(
      "POST",
      apiRoutes.ACL_ROLE_NOTIF_PERMISSION1,
      body,
      "SAVE",
      ({ data }) => {
        router.back();
        setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title="اجازه ارسال اعلان"
          hasBackButton
          hasCreateButton={false}
        />
      </div>
      {/*********************** TABLE ************************/}
      <div className="my-8 flex flex-wrap gap-4">
        {selectableItems?.map(
          (e: { id: number; title: string; value: string }) => (
            <Checkbox
              key={e.id}
              isSelected={permissions.includes(e.value)}
              onValueChange={() => handleCheckbox(e.value)}
              color="success"
            >
              <p className="mr-2 font-bold">{e.title}</p>
            </Checkbox>
          )
        )}
      </div>
      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={isLoading || disabled} onPress={onSubmit} />
    </div>
  );
};

export default NotificationPermissionsPage;
