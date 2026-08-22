"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";

import { Divider } from "@/components/shared/Divider";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps, ShowProps } from "@/components/Table/table.type";
import Detail from "@/components/Show/Details";
import { Input } from "@nextui-org/react";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty, tail } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import FormSelect from "@/components/Form/FormSelect";
import Notify from "@/components/shared/Toast";
import { useQueryGet } from "@/helpers/query-get.hooks";
import { AdminRole } from "@/interfaces/admin-roles.enum";

type State = { [key: string]: any };

const initFormItems: CreateProps[] = [
  {
    title: "نقش",
    state: "role",
    type: "select",
    selectItems: [],
    options: { property: "name" },
  },
  {
    title: "نام کاربری",
    state: "username",
    type: "input",
    options: { titleHint: "(به انگلیسی)" },
  },
  { title: "نام و نام خانوادگی", state: "full_name", type: "input" },
  {
    title: "موبایل",
    state: "mobile_number",
    type: "input",
    options: { keyboard: "number", maxLength: 11 },
  },
  {
    title: "رمز عبور",
    state: "password",
    type: "input",
    options: { hint: "حداقل شش کاراکتر", titleHint: "(به انگلیسی)" },
  },
  {
    title: "تکرار رمز عبور",
    state: "password_repeat",
    type: "input",
    options: { titleHint: "(به انگلیسی)" },
  },
];

const AdminCreate = () => {
  const router = useRouter();
  const queriesParams = useQueryGet<any>();

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<State>({});
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [notEditableList, setNotEditableList] = useState<string[]>([]);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = () => {
    ApiCall("GET", apiRoutes.ACL_ROLES, null, "GET  ROLES", ({ data }) => {
      initFormItems[0].selectItems = data;
      setFormItems(initFormItems);
      setIsLoading(false);
    });
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    if (states.password != states.password_repeat)
      return Notify({ type: "error", body: "رمز عبور و تکرار آن یکسان نیست" });
    setDisabled(true);
    let body = {
      ...states,
      mobile_number: p2e(states.mobile_number),
      role_id: states?.role?.id,
      business_id: +queriesParams?.business_id,
    };

    console.log({ body });

    ApiCall(
      "POST",
      apiRoutes.CREATE_ADMIN,
      body,
      "SUBMIT ",
      ({ data }) => {
        router.back();
        // setDisabled(false);
      },
      () => setDisabled(false),
    );
  };

  if (isLoading || !formItems) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title={
            queriesParams.business_name
              ? `ایجاد ادمین برای ${queriesParams.business_name}`
              : "ایجاد"
          }
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      {/*********************** Form Builder ************************/}
      <FormBuilder
        formItems={formItems}
        states={states}
        setStates={setStates}
        notEditableList={notEditableList}
      />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default AdminCreate;
