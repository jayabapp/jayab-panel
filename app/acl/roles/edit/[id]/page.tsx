"use client";
import { useEffect, useState } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes } from "@/utils/urls";
import { useParams, useRouter } from "next/navigation";
import { ArrowSmallRightIcon, InboxArrowDownIcon } from "@heroicons/react/24/solid";
import PageHeader from "@/components/Table/PageHeader";
import FormInput from "@/components/Form/FormInput";
import SubmitButton from "@/components/Form/SubmitButton";
import Loading from "@/components/shared/Loading";

const EditRole = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    getRole();
  }, []);

  const getRole = () => {
    ApiCall("GET", `${apiRoutes.ACL_ROLES}/${id}`, null, "GET ROLE", ({ data }) => {
      setName(data.name);
      setIsLoading(false);
    });
  };
  /* -------------------------------- CREATE A FACILITY ------------------------------- */
  function onSubmit() {
    setDisabled(true);
    const body = {
      name,
    };
    ApiCall(
      "PUT",
      `${apiRoutes.ACL_ROLES}/${id}`,
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

  if (isLoading) return <Loading />;
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

export default EditRole;
