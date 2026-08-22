import { Button, Modal, ModalContent } from "@nextui-org/react";
import { ShowAction } from "../Table/table.type";
import { useRouter } from "next/navigation";
import { Divider } from "../shared/Divider";
import { ArrowLeftCircleIcon, ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { isEmpty } from "lodash";
import { Attachment } from "@/interfaces/schema.type";
import { SyntheticEvent, useState } from "react";
import { IMAGE_URL } from "@/utils/urls";
import { Download, X } from "@phosphor-icons/react";
import { SettingStore, useSettingStore } from "@/store";

type PropsType = {
  image: Attachment;
};
const ShowImage = ({ image }: PropsType) => {
  const setting = useSettingStore((state: SettingStore) => state.setting);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <div key={image.id}>
      <img
        src={IMAGE_URL(image)}
        className="w-44 h-44  mx-auto rounded-8 object-cover  cursor-pointer"
        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = setting?.APP_LOGO || "";
          e.currentTarget.className = "grayscale brightness-150  w-[6rem] h-[6rem] m-2 z-0";
        }}
        onClick={() => {
          setIsVisibleModal(true);
        }}
      />

      <p className="text-center line-clamp-2 w-full opacity-60  mt-2">{image.alt}</p>
      <Modal
        isOpen={isVisibleModal}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen) setIsVisibleModal(false);
          else void null;
        }}
        backdrop="blur"
        scrollBehavior="normal"
        size="xl"
      >
        <ModalContent className="app-background">
          <div className={"w-full rounded-lg p-4"}>
            <img src={IMAGE_URL(image)} className="w-full h-full object-contain" />
            <div className="flex justify-end gap-2 md:gap-4 mb-4 mt-6">
              <Button
                color="success"
                startContent={<Download className="text-black ml-2" weight="duotone" size={24} />}
                onPress={() => window.open(IMAGE_URL(image), "_blank")}
                className="w-fit"
              >
                دانـلود
              </Button>
              <Button
                color="danger"
                variant="bordered"
                startContent={<X className="text-danger ml-2" weight="regular" size={20} />}
                onPress={() => setIsVisibleModal(false)}
                className="max-w-28 w-fit"
              >
                بستن
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ShowImage;
