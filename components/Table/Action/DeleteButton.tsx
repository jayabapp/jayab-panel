import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

const DeleteButton = ({ onPress }: { onPress: any }) => {
  return (
    <Button
      color="danger"
      variant="flat"
      size="sm"
      startContent={<TrashIcon className="w-3" />}
      className="w-24"
      onPress={onPress}
    >
      حذف
    </Button>
  );
};

export default DeleteButton;
