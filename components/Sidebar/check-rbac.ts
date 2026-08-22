import { AuthStore, SettingStore, useAuthStore, useSettingStore } from "@/store";
import { first, isEmpty, last } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const whitelist = ["auth", "403"];

export const CheckRBAC = () => {
  const adminAccess = useAuthStore((state: AuthStore) => state.adminAccess);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const route = pathname?.substring(1);
    const arr = route.split("/");

    if (arr.length < 1) return;

    const moduleName = first(arr) || "";
    const action = arr[1] || moduleName;
    if (whitelist.includes(moduleName) || !moduleName) return;

    const moduleAccess = adminAccess.find((e: any) => e.module?.key == moduleName);

    let hasAccess = false;
    switch (action) {
      case "create":
        hasAccess = moduleAccess?.c || false;
        break;
      case "edit":
        hasAccess = moduleAccess?.u || false;
        break;
      case "show":
      case moduleName:
        hasAccess = moduleAccess?.v || false;
        break;
      default:
        hasAccess = true;
        break;
    }
    console.log({ routerr: pathname, moduleName, hasAccess, action, moduleAccess });

    // if (!hasAccess) router.replace("/403");
  }, [pathname]);
};
