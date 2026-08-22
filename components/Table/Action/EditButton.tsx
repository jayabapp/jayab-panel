import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

const EditButton = ({ onPress }: { onPress: any }) => {
  return (
    <Button
      color="warning"
      variant="solid"
      size="sm"
      startContent={<PencilIcon className="w-3" />}
      className="w-24"
      onPress={onPress}
    >
      ویرایش
    </Button>
  );
};

export default EditButton;
