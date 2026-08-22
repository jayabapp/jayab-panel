import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

const ShowButton = ({ onPress }: { onPress: any }) => {
  return (
    <Button
      color="success"
      variant="solid"
      size="sm"
      startContent={<EyeIcon className="w-3" />}
      className="w-24"
      onPress={onPress}
    >
      نمایش
    </Button>
  );
};

export default ShowButton;
