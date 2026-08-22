"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiCall } from "@/helpers/ApiCall";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { apiRoutes, IMAGE_URL } from "@/utils/urls";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Modal,
  ModalContent,
} from "@nextui-org/react";
import { isEmpty, range } from "lodash";
import {
  ChevronLeftIcon,
  FolderMinusIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import FormInput from "@/components/Form/FormInput";
import { PrimitiveObject } from "@/interfaces/schema.type";
import { Divider } from "@/components/shared/Divider";
import { p2e } from "@/helpers/p2e";

const endpoint = `${apiRoutes.CITIES1}/cascade`;
type City = any;

const Cities = () => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<{ title: string; id: number }[]>([]);
  const [parentIds, setParentIds] = useState<Array<City>>([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [cities, setCities] = useState([]);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<PrimitiveObject>();
  const [selectedParent, setSelectedParent] = useState<any>();
  const [newCityTitle, setNewCityTitle] = useState<string>("");
  const [newCitySort, setNewCitySort] = useState("");

  useEffect(() => {
    getList();
  }, []);

  /* -------------------------------- GET LIST -------------------------------- */
  const getList = () => {
    ApiCall(
      "GET",
      `${endpoint}`,
      null,
      "GET LIST",
      ({ data }: { data: Array<City> }) => {
        setList(data);
        setIsLoading(false);
      },
    );
  };

  const onDelete = () => {
    setDisabled(true);
    ApiCall(
      "DELETE",
      `${apiRoutes.CITIES1}/${selectedItemId}`,
      null,
      "DELETE",
      () => {
        getList();
        setDisabled(false);
        setSelectedItemId(null);
      },
      () => setDisabled(false),
    );
  };

  const onSubmit = () => {
    setDisabled(true);

    const body = {
      title: newCityTitle,
      parent_id: selectedParent?.id,
      sort_order: +p2e(newCitySort) || null,
    };

    // console.log({ body });

    ApiCall(
      "POST",
      apiRoutes.CITIES1,
      body,
      "SUBMIT CITY",
      ({ data }) => {
        getList();
        setSelectedParent(null);
        setVisibleEditModal(false);
        setNewCityTitle("");
        setNewCitySort("");
        setDisabled(false);
      },
      () => {
        setDisabled(false);
      },
    );
  };

  const createExpandedKeys = () => {
    setParentIds(range(0, 10000).map((_) => `${_}`)); //to open all accordion
  };

  function TreeNode({ node, depth }: { node: City; depth: number }) {
    const isLastLevel = isEmpty(node.child);
    const isParent = !node.parent_id;

    return (
      <Accordion
        selectionMode="multiple"
        fullWidth={false}
        defaultExpandedKeys={parentIds}
        className={
          !node.parent_id
            ? "bg-gray-200  dark:bg-slate-900  border border-neutral-300 dark:border-slate-800 mt-2 py-3 px-3 rounded-xl"
            : ""
        }
      >
        <AccordionItem
          title={
            <div className="flex items-center">
              {node.image && (
                <img
                  className="w-10 h-10 rounded-10 ml-1.5"
                  src={IMAGE_URL(node.image)}
                />
              )}
              <div className="text-right text-sm app-text font-bold">{`${node.title}`}</div>
            </div>
          }
          classNames={{
            content: "bg-neutral-100 dark:bg-slate-800 rounded-xl",
          }}
          key={node.id}
          // style={{ paddingRight }}
          indicator={() => <></>}
          subtitle={
            <div className="flex items-center">
              <div className="text-right font-light text-sm">
                {!node.parent_id ? "استان" : depth === 1 ? "شهر" : "محله"}
              </div>
              <div className="flex gap-4 mr-4">
                <Button
                  size="sm"
                  color="secondary"
                  variant="flat"
                  onPress={() => router.push(`/cities/${node.id}/edit`)}
                >
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => setSelectedItemId(node.id)}
                >
                  حذف
                </Button>
                {depth < 2 && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      setSelectedParent(node);
                      setVisibleEditModal(true);
                    }}
                  >
                    {!node.parent_id ? "افزودن شهـر" : "افزودن محله"}
                  </Button>
                )}
              </div>
            </div>
          }
          startContent={
            <div className="flex items-center">
              <div
                className={`border border-dashed border-gray-300 dark:border-slate-600`}
                style={{ width: depth * 80 }}
              />
              <ChevronLeftIcon className="w-3" />
            </div>
          }
        >
          {node.child?.map((child: any) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </AccordionItem>
      </Accordion>
    );
  }

  if (isLoading) return <Loading />;
  return (
    <div className="">
      {/*********************** PAGE HEADER ************************/}
      <PageHeader
        model="کشورها"
        createRoute={`/cities/${undefined}/create`}
        modelTitle="استان"
        hasCreateButton={true}
      >
        <Button
          color="success"
          variant="light"
          startContent={<FolderPlusIcon className="w-5" />}
          onPress={() => createExpandedKeys()}
        >
          باز کردن همه
        </Button>
        <Button
          color="danger"
          variant="light"
          startContent={<FolderMinusIcon className="w-5" />}
          onPress={() => setParentIds([])}
        >
          بستن همه
        </Button>
      </PageHeader>

      {/*********************** TREE ************************/}
      <div className="">
        {list.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} />
        ))}
      </div>

      {/*********************** DELETE MODAL  ************************/}
      <ConfirmModal
        text={"آیا میخواهید این آیتم را حذف کنید؟"}
        isVisible={!!selectedItemId}
        isLoading={disabled}
        onHide={() => setSelectedItemId(null)}
        onConfirm={() => {
          onDelete();
        }}
      />

      <Modal
        isOpen={visibleEditModal}
        onClose={() => setVisibleEditModal(false)}
      >
        <ModalContent
          // onBlur={() => setNewCityTitle("")}
          className="app-background px-4 py-8"
        >
          <div className="app-text mx-4 mt-6">
            <div className="">
              <FormInput
                title={
                  !selectedParent?.parent_id ? "نام شهر" : "نام محله یا منطقه"
                }
                options={{
                  containerClass: "w-full",
                  placeholder: "تهران",
                  maxLength: 50,
                  keyboard: "text",
                }}
                onChangeText={setNewCityTitle}
                value={newCityTitle}
                showX={false}
              />
              <FormInput
                title="ترتیب نمایش"
                options={{
                  containerClass: "w-full",
                  placeholder: "مثلا: 1",
                  keyboard: "number",
                }}
                onChangeText={setNewCitySort}
                value={newCitySort}
                showX={false}
              />
            </div>
            <div className="sticky bottom-0 left-0 right-0 flex flex-col jusstify-between itemss-center w-full pt-2 pb-4">
              <Divider moreClass="opacity-0 mt-1" />
              <Button
                color="primary"
                // variant="ghost"
                disabled={disabled}
                isLoading={disabled}
                onPress={() => {
                  onSubmit();
                }}
              >
                ثبت
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Cities;
