"use client";

import { prepareTitleTranslations } from "@/components/Content/TitleTranslationsEditor";
import { PropertyOptionGroupList } from "@/interfaces/property-option-groups.type";
import { useState, useEffect } from "react";
import { PropertyOptionGroup } from "@/interfaces/property-option-groups.type";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/utils/urls";
import { EnumList } from "@/components/Table/table.type";
import { Checkbox } from "@nextui-org/react";
import { ApiCall } from "@/helpers/ApiCall";
import { Divider } from "@/components/shared/Divider";
import { groupBy } from "lodash";

import { type TitleTranslations } from "@/components/Content/TitleTranslationsEditor";

import TitleTranslationsEditor from "@/components/Content/TitleTranslationsEditor";
import FormSelectMulti from "@/components/Form/FormSelectMulti";
import ImageUploader from "@/components/Form/ImageUploader";
import SubmitButton from "@/components/Form/SubmitButton";
import FormSwitch from "@/components/Form/FormSwitch";
import PageHeader from "@/components/Table/PageHeader";
import FormSelect from "@/components/Form/FormSelect";
import FormInput from "@/components/Form/FormInput";
import Loading from "@/components/shared/Loading";

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
  const [isLoading, setIsLoading] = useState(Boolean(pageId));
  const [states, setStates] = useState<State>({});
  const [translations, setTranslations] = useState<TitleTranslations>({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState<{
    [key in PropertyOptionGroup]?: any[];
  }>({});
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
        setTranslations(data.data?.translations ?? {});
        setSelectedOptions(data.data?.options);
        setIsLoading(false);
      },
    );
  };

  const onChange = (key: string, value: any) =>
    setStates((prev) => ({ ...prev, [key]: value }));

  const _findOptionTitle = (key: string): string => {
    const t = PropertyOptionGroupList.find((e) => e.id === key)?.title;
    return t || "";
  };

  const onSubmit = () => {
    setDisabled(true);
    const body = {
      ...states,
      translations: prepareTitleTranslations(translations),
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
      },
      () => setDisabled(false),
    );
  };

  if (isLoading) return <Loading />;
  return (
    <div className="app-container-profile ">
      <div>
        <PageHeader
          hasBackButton={true}
          hasCreateButton={false}
          title={pageId ? "ویرایش صفحه لندینگ" : "ایجاد صفحه لندینگ"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <FormInput
          showX={false}
          title="عنوان فارسی"
          value={states?.title}
          options={{ placeholder: "عنوان صفحه لندینگ" }}
          onChangeText={(v) => onChange("title", v)}
        />
        <TitleTranslationsEditor
          value={translations}
          disabled={disabled}
          onChange={setTranslations}
        />
        <FormInput
          showX={false}
          title="آدرس url"
          value={states?.url}
          options={{ placeholder: "آدرس" }}
          onChangeText={(v) => onChange("url", v)}
        />
        <FormSelect
          showX={false}
          list={contents}
          title="محتوای اصلی"
          value={states?.main_content}
          searchRoute="/admin/contents"
          options={{ isSearchable: true }}
          onSelect={(v) => onChange("main_content", v)}
          onSearchCompleted={(list) => setContents(list)}
        />
        <FormSelectMulti
          options={{}}
          isSearchable
          title="صفحات مرتبط"
          list={landingPages}
          searchRoute="/admin/landing-pages"
          value={states?.related_landings || []}
          onSearchCompleted={(list) => setLandingPages(list)}
          onSelect={(v) => onChange("related_landings", v)}
        />
        <Divider moreClass="col-span-full" />
        <FormInput
          showX={false}
          title="ترتیب نمایش"
          value={states?.sort_order}
          options={{ titleHint: "(اختیاری)" }}
          onChangeText={(v) => onChange("sort_order", v)}
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
          showX={true}
          title="استان"
          list={provinces}
          fixQuery="is_parent=1"
          value={states?.province}
          searchRoute="/admin/cities"
          options={{ isSearchable: true }}
          onSelect={(v) => onChange("province", v)}
          onSearchCompleted={(list) => setProvinces(list)}
          onRemoveValue={() => onChange("province", null)}
        />
        <FormSelectMulti
          options={{}}
          list={cities}
          title="شهـرها"
          isSearchable={true}
          fixQuery="is_parent=0"
          value={states?.cities}
          searchRoute="/admin/cities"
          onSelect={(v) => onChange("cities", v)}
          onSearchCompleted={(list) => setCities(list)}
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
                        if (selectedOptions.includes(option.id))
                          setSelectedOptions((e) =>
                            e.filter((_) => _ !== option.id),
                          );
                        else setSelectedOptions((e) => [...e, option.id]);
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
        <ImageUploader
          title="تصویر"
          options={{}}
          disabled={false}
          list={[states?.image]}
          onDelete={() => void false}
          onSelect={(v: number) => onChange("image", v)}
        />
      </div>
      <SubmitButton disabled={disabled} onPress={onSubmit} />
    </div>
  );
};

export default LandingPageCreate;
