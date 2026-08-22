"use client";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import { Button } from "@nextui-org/react";
import FormBuilder from "@/components/Form/FormBuilder";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import FormSelect from "@/components/Form/FormSelect";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { XCircleIcon } from "@heroicons/react/24/outline";

type State = { [key: string]: any };

const endpoint = apiRoutes.BANNER1;

const BannersCreate = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState<any>();

  useEffect(() => {
    getFormItems();
  }, []);

  const getFormItems = () => {
    ApiCall(
      "GET",
      `${endpoint}/model-props`,
      null,
      "GET FORM ITEMS",
      ({ data }) => {
        let props = data.createProps;

        props = props.filter(
          (e: any) => e.state !== "business_name" && e.state !== "business_id"
        );
        setFormItems(props || []);
        setIsLoading(false);
      }
    );
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    if (selectedProperty) body = { ...body, property_id: selectedProperty.id };

    ApiCall(
      "POST",
      endpoint,
      body,
      "SUBMIT ",
      ({ data }) => {
        router.back();
        // setDisabled(false);
      },
      () => setDisabled(false)
    );
  };

  if (isLoading || !formItems) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title="ایجاد"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      <div className="bg-warning/10 text-warning-500 px-3 py-2 rounded-lg w-fit mt-6">
        در صورت نیاز میتوانید بنر را به یک ملک وصل کنید
      </div>
      <div className="flex gap-6">
        {/* SEARCH PROPERTY */}
        <div className="my-10 w-2/6 m-1">
          <FormSelect
            options={{ isSearchable: true, placeholder: "نام ملک" }}
            value={selectedProperty}
            title="جستجوی ملک براساس نام"
            searchRoute={apiRoutes.PROPERTY1}
            fixQuery="status=30"
            onSearchCompleted={(list) => setProperties(list)}
            list={properties}
            onSelect={(value: any) => {
              setSelectedProperty(value);
            }}
            showX={false}
          ></FormSelect>

          {selectedProperty?.title && (
            <div className="mt-4 mx-1 font-light opacity-75 text-xs flex items-center">
              مورد انتخاب شده:
              <span className="mr-2 font-medium text-teal-400 text-sm">
                {selectedProperty?.title || ""} - {selectedProperty?.code || ""}
              </span>
              <Button
                size="sm"
                variant="bordered"
                color="danger"
                className="mr-3"
                onPress={() => setSelectedProperty(null)}
                startContent={<XCircleIcon className="w-4" />}
              >
                <p className="text-[10px]">حذف</p>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/*********************** Form Builder ************************/}
      <FormBuilder
        formItems={formItems}
        states={states}
        setStates={setStates}
        notEditableList={[]}
      />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default BannersCreate;
