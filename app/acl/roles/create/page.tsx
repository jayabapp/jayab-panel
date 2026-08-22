"use client";
import { useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { ArrowSmallRightIcon, InboxArrowDownIcon } from "@heroicons/react/24/solid";
import PageHeader from "@/components/Table/PageHeader";
import FormInput from "@/components/Form/FormInput";
import SubmitButton from "@/components/Form/SubmitButton";

const CreateRolePage = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const [name, setName] = useState("");

  /* -------------------------------- CREATE A FACILITY ------------------------------- */
  function onSubmit() {
    setDisabled(true);
    const body = {
      name,
    };
    ApiCall(
      "POST",
      apiRoutes.ACL_ROLES,
      body,
      "CREATE ROLE",
      ({ data }) => {
        router.back();
      },
      () => {
        setDisabled(false);
      }
    );
  }

  return (
    <div className="app-container-profile">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader title="افزودن نقش" hasCreateButton={false} hasBackButton={true} />
      </div>

      {/*********************** INPUTS ************************/}
      <div className=" grid grid-cols-1 lg:grid-cols-3  2xl:grid-cols-4 lg:gap-x-8">
        <div className="col-span-1">
          <FormInput
            title="نام"
            options={{
              maxLength: 50,
            }}
            onChangeText={setName}
            value={name}
            showX={false}
          />
        </div>
      </div>

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default CreateRolePage;
