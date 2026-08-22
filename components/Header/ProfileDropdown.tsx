import { ChevronDownIcon, PowerIcon, UserCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button } from "@nextui-org/react";
import { Divider } from "../shared/Divider";
import { AuthStore, useAuthStore } from "@/store";

const ProfileDropdown = () => {
  const router = useRouter();
  const adminInfo = useAuthStore((state: AuthStore) => state.adminInfo);

  // const [adminInfo, setAdminInfo] = useState<any>();
  console.log(localStorage.getItem("admin_info"));

  // useEffect(() => {
  //   parseAdminInfo();
  // }, []);

  // const parseAdminInfo = () => {
  //   try {
  //     let info = JSON.parse(localStorage.getItem("admin_info") ?? "") as any;
  //     setAdminInfo(info);
  //   } catch (error) {}
  // };
  const _logout = () => {
    localStorage.setItem("token", "");
    router.replace("/auth");
  };
  return (
    <div className="text-right">
      <Dropdown classNames={{ base: "bg-gray-200 dark:bg-slate-900" }}>
        <DropdownTrigger>
          <Button variant="flat" color="default" endContent={<ChevronDownIcon className="w-4" />}>
            <p className="mx-4">{"پروفایل"}</p>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="name"
            className="text-black dark:text-white"
            startContent={<UserCircleIcon className="w-8" />}
          >
            <div>
              <p>
                {adminInfo?.full_name} <span className="text-sm text-gray-500">({adminInfo?.mobile_number})</span>
              </p>
              <p className="font-light text-xs mt-1">{adminInfo?.username}@</p>
            </div>
          </DropdownItem>
          <DropdownSection className="border-t-1 border-gray-300 dark:border-slate-800 pt-2 mt-2">
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              startContent={<PowerIcon className="w-5" />}
              onPress={_logout}
            >
              خروج از حساب کاربری
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
