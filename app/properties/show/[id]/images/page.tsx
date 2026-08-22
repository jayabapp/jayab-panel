"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ApiCall } from "@/helpers/ApiCall";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/Loading";
import PageHeader from "@/components/Table/PageHeader";
import { ShowAction, ShowProps } from "@/components/Table/table.type";
import Detail from "@/components/Show/Details";
import { apiRoutes } from "@/utils/urls";
import ShowActions from "@/components/Show/ShowActions";
import ChangeStatus from "@/components/Show/ChangeStatus.component";
import ShowImage from "@/components/Show/ShowImage";
import { Attachment } from "@/interfaces/schema.type";
import { Button } from "@nextui-org/react";
import Notify from "@/components/shared/Toast";
import { Divider } from "@/components/shared/Divider";
import SubmitButton from "@/components/Form/SubmitButton";

const endpoint = apiRoutes.PROPERTY1;

const PropertyImages = () => {
  const params = useParams();
  const { id } = params || {};

  const router = useRouter();
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<Attachment[]>([]);
  const [data, setData] = useState<any>({});
  const [featureImageId, setFeatureImageId] = useState<number>();
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [dragOverImageId, setDragOverImageId] = useState<number | null>(null);

  const [tempImages, setTempImages] = useState<Attachment[]>([]);

  useEffect(() => {
    getData();
  }, []);

  /* -------------------------------- GET DATA -------------------------------- */
  const getData = () => {
    ApiCall(
      "GET",
      `${endpoint}/${id}`,
      null,
      "GET DATA",
      (res: {
        data: { showProps: ShowProps[]; actions: ShowAction[]; item: any };
      }) => {
        const item = res.data.item;
        setData(item);
        setFeatureImageId(item.feature_image_id);
        setImages(item.attachments);
        setTempImages(item.temp_attachments || []);
        setIsLoading(false);
      },
    );
  };

  const handleTempImage = (id: number) => {
    const target = images.find((img) => img.id === id);
    if (!target) return;
    if (target.id === featureImageId)
      return Notify({ type: "error", body: "تصویر شاخص امکان حذف شدن ندارد" });

    setTempImages([...tempImages, target]);
    setImages(images.filter((img) => img.id !== id));
  };

  const handleReturnTempImage = (id: number) => {
    const target = tempImages.find((img) => img.id === id);
    if (!target) return;
    setImages([...images, target]);
    setTempImages(tempImages.filter((img) => img.id !== id));
  };

  const handleReorderImages = (targetId: number) => {
    if (!draggedImageId || draggedImageId === targetId) {
      setDraggedImageId(null);
      setDragOverImageId(null);
      return;
    }

    const draggedIndex = images.findIndex((img) => img.id === draggedImageId);
    const targetIndex = images.findIndex((img) => img.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;

    const nextImages = [...images];
    const [draggedImage] = nextImages.splice(draggedIndex, 1);
    nextImages.splice(targetIndex, 0, draggedImage);
    setImages(nextImages);
    setDraggedImageId(null);
    setDragOverImageId(null);
  };

  const onSubmit = () => {
    setDisable(true);
    const body = {
      images: images
        .filter((e) => e.id !== featureImageId)
        .map((img) => img.id),
      temp_images: tempImages.map((img) => img.id),
      feature_image_id: featureImageId,
    };
    ApiCall(
      "PUT",
      `${endpoint}/${id}/images`,
      body,
      "UPDATE IMAGE",
      (res: any) => {
        setDisable(false);
      },
      () => setDisable(false),
    );
  };

  if (isLoading || !data) return <Loading />;
  return (
    <div className="app-container-profile ">
      {/*********************** Page HEADER ************************/}
      <div>
        <PageHeader
          title={`تصاویر ${data.title} - کد ${data.code}`}
          hasCreateButton={false}
          hasBackButton={true}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <p className="text-xl font-bold text-teal-500">تصاویر فعال:</p>
        <p className="text-sm opacity-60">
          برای تغییر ترتیب، تصویر را بکشید و روی جایگاه جدید رها کنید.
        </p>
      </div>
      <div className="flex flex-wrap gap-5 mb-8">
        {images.map((img: Attachment) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => setDraggedImageId(img.id)}
            onDragEnter={() => setDragOverImageId(img.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={() => {
              setDraggedImageId(null);
              setDragOverImageId(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleReorderImages(img.id);
            }}
            className={`flex flex-col relative z-10 cursor-grab active:cursor-grabbing rounded-8 p-1 transition ${
              dragOverImageId === img.id && draggedImageId !== img.id
                ? "ring-2 ring-teal-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                : ""
            } ${draggedImageId === img.id ? "opacity-60" : ""}`}
          >
            {img.id === featureImageId && (
              <div className="absolute top-1 left-4 bg-black/70 text-white text-xs rounded-4 p-1.5">
                تصویر شاخص
              </div>
            )}

            <ShowImage image={img} />
            <div className="grid grid-cols-2 gap-1">
              <Button
                color="warning"
                size="sm"
                variant="flat"
                onPress={() => setFeatureImageId(img.id)}
              >
                شاخص
              </Button>
              <Button
                color="danger"
                size="sm"
                variant="flat"
                onPress={() => handleTempImage(img.id)}
              >
                حذف موقت
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Divider moreClass="mb-8" />
      <p className="text-xl font-bold mb-4 text-red-500">تصاویر غیرفعال:</p>
      <div className="flex flex-wrap gap-5">
        {tempImages.map((img: Attachment) => (
          <div key={img.id} className="flex flex-col relative z-10">
            <ShowImage image={img} />
            <div className="grid grid-cols-1 gap-1">
              <Button
                color="success"
                size="sm"
                variant="flat"
                onPress={() => handleReturnTempImage(img.id)}
              >
                برگشت به لیست تصاویر
              </Button>
            </div>
          </div>
        ))}
      </div>

      <SubmitButton onPress={onSubmit} disabled={disable} />
    </div>
  );
};

export default PropertyImages;
