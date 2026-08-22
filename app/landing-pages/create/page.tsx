"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import {
  CreateProps,
  EnumList,
  ShowProps,
} from "@/components/Table/table.type";
import FormBuilder from "@/components/Form/FormBuilder";
import { produce } from "immer";
import SubmitButton from "@/components/Form/SubmitButton";
import { apiRoutes } from "@/utils/urls";
import { apiBodyCreator } from "@/helpers/generator/ApiBodyCreator.helper";
import FormInput from "@/components/Form/FormInput";
import { Divider } from "@/components/shared/Divider";
import FormSwitch from "@/components/Form/FormSwitch";
import FormSelect from "@/components/Form/FormSelect";
import FormSelectMulti from "@/components/Form/FormSelectMulti";
import { groupBy } from "lodash";
import { Checkbox } from "@nextui-org/react";
import {
  PropertyOptionGroup,
  PropertyOptionGroupList,
} from "@/interfaces/property-option-groups.type";
import ImageUploader from "@/components/Form/ImageUploader";
import { useQueryGet } from "@/helpers/query-get.hooks";

type State = { [key: string]: any };

const endpoint = apiRoutes.LANDING_PAGE1;

enum LandingPagePosition {
  POPULAR_CITY = "popular_city",
  QUICK_SEARCH = "quick_search",
}

const landingPagePositionList: EnumList[] = [
  {
    id: LandingPagePosition.POPULAR_CITY,
    title: "شهرهای پربازدید",
    hex: "#f59e0b",
  },
  {
    id: LandingPagePosition.QUICK_SEARCH,
    title: "جستجوی سریع",
    hex: "#14b8a6",
  },
];

const LandingPageCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page_id");

  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<State>({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState<{
    [key in PropertyOptionGroup]?: any[];
  }>({});
  // const [positionList, setPositionList] = useState<EnumList[]>([]);

  const [contents, setContents] = useState([]);
  const [landingPages, setLandingPages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    getProvinces();
    getPropertyOptions();
  }, []);

  const getProvinces = () => {
    ApiCall(
      "GET",
      `${apiRoutes.CITIES1}/parents`,
      null,
      "GET PROVINCES",
      ({ data }) => {
        setProvinces(data);
      },
    );
  };

  const getPropertyOptions = () => {
    ApiCall(
      "GET",
      `${apiRoutes.PROPERTY_OPTIONS1}?page=1&per_page=300`,
      null,
      "GET OPTIONS",
      ({ data }) => {
        const grouped = groupBy(data.data, "group");

        delete grouped.BUILDING_DIRECTION;
        delete grouped.ACCESS;
        delete grouped.OWNERSHIP;

        setPropertyOptions(grouped);

        if (pageId) getData();
        else setIsLoading(false);
      },
    );
  };

  const getData = () => {
    ApiCall(
      "GET",
      `${apiRoutes.LANDING_PAGE1}/${pageId}`,
      null,
      "GET DATA",
      ({ data }) => {
        setStates(data.data);
        setSelectedOptions(data.data?.options);
        // setPositionList(data.data?.position_list);
        setIsLoading(false);
      },
    );
  };

  const onChange = (key: string, value: any) => {
    setStates((prev) => ({ ...prev, [key]: value }));
  };

  const _findOptionTitle = (key: string): string => {
    const t = PropertyOptionGroupList.find((e) => e.id === key)?.title;
    return t || "";
  };

  /* ------------------------------- SUBMIT FORM ------------------------------ */
  const onSubmit = () => {
    setDisabled(true);

    const body = {
      ...states,
      province_id: states.province?.id,
      cities: states.cities?.map((e: any) => e.id),
      options: selectedOptions || [],
      image_id: states?.image?.id,
      main_content_id: states?.main_content?.id,
      related_landings: states?.related_landings?.map((e: any) => e.id),
    };

    console.log({ body });

    ApiCall(
      pageId ? "PUT" : "POST",
      pageId ? `${endpoint}/${pageId}` : endpoint,
      body,
      "SUBMIT ",
      ({ data }) => {
        router.back();
        // setDisabled(false);
      },
      () => setDisabled(false),
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title="ایجاد صفحه لندینگ"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/*********************** FORM ************************/}
        <FormInput
          options={{ placeholder: "عنوان صفحه لندینگ" }}
          title="عنوان"
          onChangeText={(v) => onChange("title", v)}
          value={states?.title}
          showX={false}
        />
        <FormInput
          options={{ placeholder: "آدرس" }}
          title="آدرس url"
          onChangeText={(v) => onChange("url", v)}
          value={states?.url}
          showX={false}
        />
        <FormSelect
          title="محتوای اصلی"
          options={{ isSearchable: true }}
          list={contents}
          searchRoute="/admin/contents"
          onSearchCompleted={(list) => setContents(list)}
          onSelect={(v) => onChange("main_content", v)}
          value={states?.main_content}
          showX={false}
        />
        <FormSelectMulti
          options={{}}
          title="صفحات مرتبط"
          list={landingPages}
          searchRoute="/admin/landing-pages"
          onSearchCompleted={(list) => setLandingPages(list)}
          onSelect={(v) => onChange("related_landings", v)}
          value={states?.related_landings || []}
          isSearchable
        />
        <Divider moreClass="col-span-full" />
        <FormInput
          options={{ titleHint: "(اختیاری)" }}
          title="ترتیب نمایش"
          onChangeText={(v) => onChange("sort_order", v)}
          value={states?.sort_order}
          showX={false}
        />
        <FormSwitch
          title="فعال"
          checked={states?.is_active}
          onCheck={(v) => onChange("is_active", v)}
        />
        <Divider moreClass="col-span-full" />
        <div className="flex flex-wrap gap-3 col-span-full">
          <p className="text-lg font-bold text-teal-500">موقعیت نمایش:</p>
          {landingPagePositionList?.map((e) => (
            <Checkbox
              key={e.id}
              onValueChange={(v) => onChange("position", e.id)}
              isSelected={states?.position === e.id}
            >
              <span className="mr-2"> {e.title}</span>
            </Checkbox>
          ))}
        </div>
        <Divider moreClass="col-span-full" />
        <FormSwitch
          title="نمایش در صفحه اصلی"
          checked={states?.show_in_home}
          onCheck={(v) => onChange("show_in_home", v)}
        />
        <FormSwitch
          title="نمایش در فوتر"
          checked={states?.show_in_footer}
          onCheck={(v) => onChange("show_in_footer", v)}
        />
        <Divider moreClass="col-span-full" />
        <FormSwitch
          title="استخردار"
          checked={states?.has_pool}
          onCheck={(v) => onChange("has_pool", v)}
        />
        <FormSwitch
          title="ممتاز"
          checked={states?.is_premium}
          onCheck={(v) => onChange("is_premium", v)}
        />

        <Divider moreClass="col-span-full" />
        <FormSelect
          title="استان"
          options={{ isSearchable: true }}
          list={provinces}
          searchRoute="/admin/cities"
          onSearchCompleted={(list) => setProvinces(list)}
          fixQuery="is_parent=1"
          onSelect={(v) => onChange("province", v)}
          value={states?.province}
          showX={true}
          onRemoveValue={() => onChange("province", null)}
        />
        <FormSelectMulti
          title="شهـرها"
          isSearchable={true}
          list={cities}
          searchRoute="/admin/cities"
          onSearchCompleted={(list) => setCities(list)}
          fixQuery="is_parent=0"
          onSelect={(v) => onChange("cities", v)}
          value={states?.cities}
          options={{}}
        />
        <Divider moreClass="col-span-full" />
        <div className="flex flex-col col-span-full">
          {Object.keys(propertyOptions)?.map((optionKey: string) => (
            <div key={optionKey} className="flex flex-col gap-1 my-2">
              <p className="font-bold text-teal-500">
                {_findOptionTitle(optionKey)}:
              </p>
              <div className="flex flex-wrap gap-1">
                {propertyOptions[optionKey as PropertyOptionGroup]?.map(
                  (option: { id: number; title: string }) => (
                    <Checkbox
                      key={option.id}
                      onValueChange={(v) => {
                        if (selectedOptions.includes(option.id)) {
                          setSelectedOptions((e) =>
                            e.filter((_) => _ !== option.id),
                          );
                        } else {
                          setSelectedOptions((e) => [...e, option.id]);
                        }
                      }}
                      isSelected={selectedOptions.includes(option.id)}
                    >
                      <p className="mr-2">{option.title}</p>
                    </Checkbox>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        {/* <Divider moreClass="col-span-full" />
        <FormInput
          options={{ keyboard: "number" }}
          title="حداقل درصد تخفیف"
          onChangeText={(v) => onChange("min_discount_percentage", v)}
          value={states?.min_discount_percentage}
          showX={false}
        />
        <FormInput
          options={{ keyboard: "number" }}
          title="کمترین قیمت"
          onChangeText={(v) => onChange("min_price", v)}
          value={states?.min_price}
          showX={false}
        />
        <FormInput
          options={{ keyboard: "number" }}
          title="بیشترین قیمت"
          onChangeText={(v) => onChange("max_price", v)}
          value={states?.max_price}
          showX={false}
        />
        <FormInput
          options={{ keyboard: "number" }}
          title="کمترین اتاق"
          onChangeText={(v) => onChange("min_bedroom", v)}
          value={states?.min_bedroom}
          showX={false}
        />
        <FormInput
          options={{ keyboard: "number" }}
          title="بیشترین اتاق"
          onChangeText={(v) => onChange("max_bedroom", v)}
          value={states?.max_bedroom}
          showX={false}
        />
        <Divider moreClass="col-span-full" /> */}
        <ImageUploader
          title="تصویر"
          options={{}}
          onSelect={(v: number) => onChange("image", v)}
          list={[states?.image]}
          onDelete={() => void false}
          disabled={false}
        />
      </div>
      {/*********************** SUBMIT BUTTON ************************/}
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default LandingPageCreate;
