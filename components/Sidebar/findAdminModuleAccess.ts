import { AuthStore, useAuthStore } from "@/store";

export const FindAdminModuleAccess = (moduleName: string) => {
  const adminAccess = useAuthStore((state: AuthStore) => state.adminAccess);
  const rbac = adminAccess.find((e) => e?.module?.key == moduleName);
  return rbac;
};
