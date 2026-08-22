"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Chip } from "@nextui-org/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ImageUploader from "@/components/Form/ImageUploader";
import ShowImage from "@/components/Show/ShowImage";
import ShowActions from "@/components/Show/ShowActions";
import PageHeader from "@/components/Table/PageHeader";
import Loading from "@/components/shared/Loading";
import { ApiCall } from "@/helpers/ApiCall";
import { Attachment } from "@/interfaces/schema.type";
import { apiRoutes } from "@/utils/urls";
import { ShowAction } from "@/components/Table/table.type";

const endpoint = apiRoutes.PHOTO_UPGRADE_REQUEST1;

type PhotoUpgradeItem = {
  id: number;
  status: number;
  status_title?: string;
  is_edited?: boolean;
  attachment?: Attachment;
  current_attachment?: Attachment;
  original_attachment?: Attachment | null;
  previous_attachment?: Attachment | null;
};

type PhotoUpgradeRequest = {
  id: number;
  status_title?: string;
  image_count?: number;
  property?: {
    id: number;
    title?: string;
    code?: string;
    temp_attachments?: Attachment[];
  };
  owner?: {
    full_name?: string;
    mobile_number?: string;
  };
  items: PhotoUpgradeItem[];
};

const statusColor = (isEdited?: boolean) => (isEdited ? "success" : "primary");

const PhotoUpgradeRequestsShow = () => {
  const params = useParams();
  const { id } = params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [item, setItem] = useState<PhotoUpgradeRequest | null>(null);
  const [actions, setActions] = useState<ShowAction[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    ApiCall(
      "GET",
      `${endpoint}/${id}`,
      null,
      "GET DATA",
      (res: {
        data: {
          actions: ShowAction[];
          item: PhotoUpgradeRequest;
        };
      }) => {
        setItem(res.data.item);
        setActions(res.data.actions || []);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
  };

  const updateImage = (requestItemId: number, attachment: Attachment) => {
    setUpdatingItemId(requestItemId);
    ApiCall(
      "PATCH",
      `${endpoint}/${id}/images/${requestItemId}`,
      { attachment_id: attachment.id },
      "UPDATE PHOTO UPGRADE IMAGE",
      (res: { data: { item: PhotoUpgradeRequest; actions: ShowAction[] } }) => {
        setItem(res.data.item);
        setActions(res.data.actions || []);
        setUpdatingItemId(null);
      },
      () => setUpdatingItemId(null),
    );
  };

  if (isLoading || !item) return <Loading />;

  return (
    <div className="app-container-profile">
      <div>
        <PageHeader
          title="جــزییـات درخواست اصلاح عکس"
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      <ShowActions actions={actions} />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <div className="bg-neutral-200 dark:bg-slate-900 rounded-8 border border-neutral-200 dark:border-slate-700 p-4">
          <p className="text-xs opacity-60 mb-2">ملک</p>
          <p className="font-bold">{item.property?.title || "-"}</p>
          <p className="text-xs opacity-60 mt-1">{item.property?.code || ""}</p>
        </div>
        <div className="bg-neutral-200 dark:bg-slate-900 rounded-8 border border-neutral-200 dark:border-slate-700 p-4">
          <p className="text-xs opacity-60 mb-2">مالک</p>
          <p className="font-bold">{item.owner?.full_name || "-"}</p>
          <p className="text-xs opacity-60 mt-1">
            {item.owner?.mobile_number || ""}
          </p>
        </div>
        <div className="bg-neutral-200 dark:bg-slate-900 rounded-8 border border-neutral-200 dark:border-slate-700 p-4">
          <p className="text-xs opacity-60 mb-2">وضعیت درخواست</p>
          <Chip color="primary" variant="flat" size="sm">
            {item.status_title || "-"}
          </Chip>
        </div>
        <div className="bg-neutral-200 dark:bg-slate-900 rounded-8 border border-neutral-200 dark:border-slate-700 p-4">
          <p className="text-xs opacity-60 mb-2">تعداد عکس</p>
          <p className="font-bold">{item.image_count ?? item.items.length}</p>
        </div>
      </section>

      <section className="space-y-4">
        {item.items.map((requestItem, index) => {
          const currentAttachment =
            requestItem.current_attachment || requestItem.attachment;
          const isEdited = !!requestItem.is_edited;
          const previousAttachment =
            requestItem.previous_attachment ||
            requestItem.original_attachment ||
            (!isEdited ? currentAttachment : null);
          const newAttachment = isEdited ? currentAttachment : null;

          return (
            <div
              key={requestItem.id}
              className="rounded-8 border border-neutral-200 dark:border-slate-700 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold">عکس {index + 1}</span>
                  <Chip color={statusColor(isEdited)} variant="flat" size="sm">
                    {requestItem.status_title || "-"}
                  </Chip>
                </div>
                {updatingItemId === requestItem.id && (
                  <Button
                    size="sm"
                    variant="light"
                    isLoading
                    startContent={<ArrowPathIcon className="w-4" />}
                  >
                    در حال ثبت
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[220px_220px_minmax(260px,1fr)] gap-5 items-start">
                <div>
                  <p className="text-sm font-bold mb-3">عکس قبلی</p>
                  {previousAttachment ? (
                    <ShowImage image={previousAttachment} />
                  ) : (
                    <p className="text-sm opacity-60">-</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold mb-3">عکس جدید</p>
                  {newAttachment ? (
                    <ShowImage image={newAttachment} />
                  ) : (
                    <p className="text-sm opacity-60 mt-4">
                      هنوز جایگزین نشده است.
                    </p>
                  )}
                </div>

                <div
                  className={
                    updatingItemId === requestItem.id
                      ? "pointer-events-none opacity-60"
                      : ""
                  }
                >
                  <ImageUploader
                    title="بارگذاری تصویر اصلاح شده"
                    list={[]}
                    disabled={updatingItemId === requestItem.id}
                    addImageLabel="انتخاب تصویر جدید"
                    canDelete={false}
                    onDelete={() => void null}
                    onSelect={(attachment: Attachment) =>
                      updateImage(requestItem.id, attachment)
                    }
                    options={{
                      imageType: "OWNER_PROPERTY_IMAGE",
                      disabled: updatingItemId === requestItem.id,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default PhotoUpgradeRequestsShow;
