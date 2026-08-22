import { useSettingStore } from "@/store";
import { SidebarRowItem, SidebarRowMenu } from "./SidebarRowItems";

export const rbacSidebarItems = (list: SidebarRowItem[], adminAccess: any): SidebarRowItem[] => {
  const safeSidebar: SidebarRowItem[] = [];
  list.map((group, index) => {
    safeSidebar[index] = group;
    const groupAccessibleItems: Array<SidebarRowMenu> = [];

    group.items?.map((row) => {
      const viewAccess = adminAccess.find((e: any) => e.module?.key == row.key)?.v;
      if (viewAccess) {
        groupAccessibleItems.push(row);
      }
    });
    safeSidebar[index].items = groupAccessibleItems;
  });

  return safeSidebar;
};
