import React from "react";
import Lottie from "react-lottie";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";

import lottieAnimation from "@/public/assets/lotties/warning.json";
const LottieComponent = Lottie as React.ComponentType<any>;

type PropTypes = {
  isVisible: boolean;
  onHide: Function;
  isLoading: boolean;
  text?: string;
  confirmText?: string;
  hideText?: string;
  onConfirm: Function;
};
const ConfirmModal = ({
  isVisible,
  onHide,
  isLoading,
  text,
  confirmText = "بله، مطمئنم",
  hideText = "خیر",
  onConfirm,
}: PropTypes) => {
  return (
    <Modal
      isOpen={isVisible}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onHide();
        else void null;
      }}
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent className="app-background">
        <ModalHeader></ModalHeader>
        <div className={"w-full rounded-lg p-4"}>
          <LottieComponent
            width={100}
            height={100}
            options={{ animationData: lottieAnimation, loop: true }}
          />
          <p className="font-light text-center text-md dark:text-neutral-200 my-5">
            {text}
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-4 mt-6">
            <Button
              color="primary"
              onPress={() => {
                if (!isLoading) {
                  onConfirm();
                }
              }}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {confirmText}
            </Button>
            <Button
              color="danger"
              onPress={() => {
                if (!isLoading) {
                  onHide();
                }
              }}
              className="max-w-28"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {hideText}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
