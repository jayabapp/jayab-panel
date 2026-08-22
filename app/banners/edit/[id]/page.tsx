"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";

import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { CreateProps } from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { isEmpty } from "lodash";
import { p2e } from "@/helpers/p2e";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import { prepareInitDataCreator } from "@/helpers/generator/PrepareInitDataCreator.helper";
import { Button } from "@nextui-org/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import FormSelect from "@/components/Form/FormSelect";

type State = { [key: string]: any };

const endpoint = apiRoutes.BANNER1;

const BannerEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formItems, setFormItems] = useState<CreateProps[]>();
  const [states, setStates] = useState<State>({});
  const [notEditableList, setNotEditableList] = useState<string[]>([]);

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState<any>();

  const [products, setProdutcs] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>();

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
        const props = data.createProps;
        setFormItems(props || []);
        getData(props);
      }
    );
  };

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = (props: CreateProps[]) => {
    ApiCall("GET", `${endpoint}/${id}`, null, "GET DATA", ({ data }) => {
      prepareInitData(data.showProps, props);

      const list = data.showProps
        ?.filter((e: any) => e.isEditable == false)
        .map((_: any) => _.state);
      setNotEditableList(list);

      setSelectedProperty(
        data?.showProps.find((e: any) => e.state === "property")?.value || null
      );

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  /**
   * اماده سازی مقادیر پیش فرض
   * در صورتی که فیلد ریلیشن داشته باشد از سمت بک کلید رف بر میگرده که با توجه به اون باید دیتای پیش فرض رو جایگذاری کرد
   * @param data
   * @param props
   */
  const prepareInitData = (data: any, props: CreateProps[]) => {
    const s = prepareInitDataCreator(data, props);
    setStates(s);
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);
    let body = apiBodyCreator(states, formItems);

    if (selectedProperty) body = { ...body, property_id: selectedProperty.id };
    else if (selectedProduct)
      body = { ...body, product_id: selectedProduct.id };

    console.log({ body });
    ApiCall(
      "PUT",
      `${endpoint}/${id}`,
      body,
      "SUBMIT EDIT",
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
          title="ویرایش"
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
            onSearchCompleted={(list) => setProperties(list)}
            list={properties}
            onSelect={(value: any) => {
              setSelectedProperty(value);
            }}
            showX={true}
          ></FormSelect>

          {selectedProperty?.title && (
            <div className="mt-4 mx-1 font-light opacity-75 text-xs flex items-center">
              مورد انتخاب شده:‌
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
        notEditableList={notEditableList || []}
      />

      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default BannerEdit;
