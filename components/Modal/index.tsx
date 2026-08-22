import React from "react";
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

type PropTypes = {
  isVisible: boolean;
  isLoading: boolean;
  onHide: Function;
  onConfirm: Function;
  children: React.ReactNode;
};
const GeneralModal = ({
  isVisible,
  isLoading,
  onConfirm,
  onHide,
  children,
}: PropTypes) => {
  return (
    <Modal
      isOpen={isVisible}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onHide();
        else void null;
      }}
      backdrop="blur"
      scrollBehavior="normal"
      size="full"
    >
      <ModalContent className="app-background">
        <ModalHeader></ModalHeader>
        <div
          className={
            "w-full rounded-lg p-4 app-background h-screen app-background pb-20 overflow-scroll"
          }
        >
          {children}
          <div className="grid grid-cols-1 fixed bottom-0 left-4 mx-auto gap-3 md:gap-6 mb-4 mt-6">
            <Button
              color="default"
              onPress={() => {
                if (!isLoading) {
                  onHide();
                }
              }}
              className="w-fit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              بستن
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default GeneralModal;
