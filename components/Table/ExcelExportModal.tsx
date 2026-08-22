import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import ExcelButton from "./ExcelButton";

type QueriesParams = Record<string, any>;

type ExcelExportModalProps = {
  queriesParams: QueriesParams;
  getList: (page: number, queries: QueriesParams, isExcel: boolean) => void;
  isExcelLoading?: boolean;
};

const ExcelExportModal = ({
  queriesParams,
  getList,
  isExcelLoading = false,
}: ExcelExportModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [skip, setSkip] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(100);

  const handleOpenModal = () => setIsOpen(true);

  const handleConfirm = () => {
    setIsOpen(false);

    getList(
      1,
      {
        ...queriesParams,
        skip,
        per_page: perPage,
      },
      true,
    );
  };

  // ✅ Validation
  const difference = perPage - skip;
  let isInvalid =
    skip < 0 || perPage <= 0 || skip > perPage || difference > 2000;

  let errorMessage = "";
  if (skip < 0) {
    errorMessage = "شماره شروع نمی‌تواند کمتر از ۰ باشد.";
    isInvalid = true;
  } else if (perPage <= 0) {
    errorMessage = "عدد حداکثر باید بزرگتر از ۰ باشد.";
    isInvalid = true;
  } else if (skip > perPage) {
    errorMessage = "شماره شروع نمی‌تواند بیشتر از حداکثر باشد.";
    isInvalid = true;
  } else if (difference > 2000) {
    errorMessage = "تعداد رکوردها برای اکسل نباید بیشتر از 2000 باشد.";
    isInvalid = true;
  }

  return (
    <>
      <ExcelButton isLoading={isExcelLoading} onPress={handleOpenModal} />

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="md">
        <ModalContent>
          <ModalHeader className="mb-2" />

          <ModalBody className="py-6 flex flex-col gap-4">
            <Input
              type="number"
              label="شماره شروع"
              value={String(skip)}
              onChange={(e) => setSkip(Number(e.target.value))}
              min={0}
            />

            <Input
              type="number"
              label="حداکثر تا"
              value={String(perPage)}
              onChange={(e) => setPerPage(Number(e.target.value))}
              min={1}
            />

            {/* 💡 Hint */}
            <p className="text-sm text-gray-500">
              توجه: حداکثر 2000 رکورد قابل دریافت است.
            </p>

            {/* ⚠️ Error */}
            {isInvalid && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              بستن
            </Button>

            <Button
              color="success"
              onPress={handleConfirm}
              isDisabled={isInvalid}
            >
              تایید و دریافت اکسل
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExcelExportModal;
