import React, { useRef, useState, useCallback } from "react";

import { ApiCall } from "@/helpers/ApiCall";
import { apiRoutes, IMAGE_URL } from "@/utils/urls";
import toast from "react-hot-toast";
import { FilmIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, Button } from "@nextui-org/react";

export type PropsType = {
  title: string;
  list: ({ name: string } | undefined)[];
  disabled: boolean;
  onSelect: Function;
  addVideoLabel?: string;
  onDelete: (videoId: number) => void;
  canDelete?: boolean;
  options?: {
    isMandatory?: boolean;
    titleClass?: string;
    titleHint?: string;
    disabled?: boolean;
  };
};
const VideoUploader = ({
  title,
  options,
  list,
  onSelect,
  addVideoLabel = "افزودن ویدیو",
  onDelete,
}: PropsType) => {
  const videoPickerRef = useRef<HTMLInputElement>(null);
  const disabled = options?.disabled;
  /* ------------------------------- CROP STATES ------------------------------ */

  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Blob>();
  const [isUploading, setIsUploading] = useState(false);

  /* ------------------------------ ON PICK FILE ------------------------------ */
  const pick = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type?.includes("video/"))
      return toast.error("لطفا از فایل ویدیو استفاده نمایید");
    else {
      setSelectedImage(file);
      setIsVisibleModal(true);
    }
  };

  const uploadTemp = (file: Blob) => {
    setIsUploading(true);
    let formData = new FormData();
    formData.append("file", file);
    // console.log({ file });

    ApiCall(
      "POST",
      apiRoutes.UPLOAD_VIDEO(),
      formData,
      "upload",
      ({ data }) => {
        onSelect(data);
        setIsUploading(false);
        setIsVisibleModal(false);
        setSelectedImage(undefined);
      },
      (err) => {
        console.log(err);
        setIsUploading(false);
      },
    );
  };

  /* ---------------------------- SOFT DELETE IMAGE --------------------------- */
  const deleteImage = (imageId: number) => {
    setIsUploading(true);

    ApiCall(
      "DELETE",
      apiRoutes.DELETE_ATTACHMENT(imageId),
      null,
      "delete",
      ({ data }) => {
        onDelete(imageId);
        setIsUploading(false);
      },
      (err) => {
        console.log(err);
        setIsUploading(false);
      },
    );
  };

  return (
    <div className="" style={{ zIndex: "100 !important" }}>
      <input
        className="hidden"
        type="file"
        id={`formFile-image}`}
        ref={videoPickerRef}
        onChange={pick}
        onClick={(e) => ((e.target as HTMLInputElement).value = "")}
      />
      <label
        // htmlFor={`input-${title}`}
        className={`block mb-3 mr-2 text-sm  pr-1 font-normal text-dark-100 dark:text-gray-300 ${
          options?.isMandatory &&
          "after:content-['*'] after:mr-1 after:text-red-500"
        } ${options?.titleClass || ""}`}
      >
        {title}
        <span className="mr-1.5 text-danger"> {options?.titleHint}</span>
      </label>
      <div
        className="flex lg:gap-4 sm:justify-start  mt-1  rounded-10"
        style={{ width: "auto", overflowX: "scroll" }}
      >
        {typeof onSelect == "function" && (
          <div className=" rounded-10 p-1 " style={{ cursor: "pointer" }}>
            <div
              className="flex  flex-col items-center justify-center  bg-neutral-100 dark:bg-slate-700 border border-dashed border-gray-400 dark:border-slate-500 rounded-10"
              onClick={() =>
                !disabled ? videoPickerRef?.current?.click() : void null
              }
            >
              <>
                <div className="rounded-20 p-2 m-2  border-dashed image-container cursor-pointer ">
                  <div className="flex  flex-col align-center justify-center rounded-8  w-100 h-100">
                    <div className="flex flex-col items-center mt-5 ">
                      <>
                        <FilmIcon className="w-16 text-neutral-500 dark:text-gray-200 " />
                        <span className="text-sm mt-2 text-neutral-500 dark:text-gray-200  text-center">
                          {addVideoLabel}
                        </span>
                        {isUploading && <Spinner />}
                      </>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        )}

        {list?.map((item: any, index) => {
          if (!item) return <></>;
          return (
            <div
              className="  rounded-10  overflow-hidden  relative"
              key={index}
            >
              <div
                className={`rounded-10 overflow-hidden image-container flex flex-col justify-center  mt-3  mx-3 cursor-pointer ${
                  isUploading && "grayscale"
                }`}
              >
                <video
                  controls
                  className="w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "/assets/icons/logo/logo.svg";
                    (e.target as HTMLImageElement).className =
                      "grayscale-70 brightness-150  w-[0.1rem] h-[0.1rem] m-2";
                  }}
                >
                  <source src={IMAGE_URL(item)} type="video/mp4" />
                </video>
              </div>
              <div className="w-44 mx-auto">
                <div
                  className="text-center mt-2 text-xs font-bold  text-danger cursor-pointer"
                  onClick={() => deleteImage(item.id)}
                >
                  حذف ویدیو
                </div>

                <p className="text-center line-clamp-2 w-full opacity-60  mt-2">
                  {item.alt}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={isVisibleModal}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen) setIsVisibleModal(false);
          else void null;
        }}
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent className="app-background">
          <ModalHeader></ModalHeader>
          <div className={"w-full rounded-lg p-4"}>
            {selectedImage && (
              <video
                controls
                autoPlay
                className="w-full lg:w-[800px] object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src =
                    "/assets/icons/logo/logo.svg";
                  (e.target as HTMLImageElement).className =
                    "grayscale-70 brightness-150  w-[0.1rem] h-[0.1rem] m-2";
                }}
              >
                <source
                  src={URL.createObjectURL(selectedImage)}
                  type="video/mp4"
                />
              </video>
            )}
            <div className="grid grid-cols-2 gap-3 md:gap-6 mb-4 mt-6">
              <Button
                color="primary"
                onPress={() => {
                  if (!isUploading && selectedImage) {
                    uploadTemp(selectedImage);
                  }
                }}
                isLoading={isUploading}
                disabled={isUploading}
              >
                اپلود
              </Button>
              <Button
                color="danger"
                variant="bordered"
                onPress={() => setIsVisibleModal(false)}
                className="max-w-28"
                isLoading={isUploading}
                disabled={isUploading}
              >
                فعلا نه
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VideoUploader;
