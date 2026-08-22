import { SidebarRowItem } from "@/components/Sidebar/SidebarRowItems";
import { EnumList } from "@/components/Table/table.type";
import { Alert } from "@/components/shared/Alert";
import { AccessControlList, Admin, ContentCategory } from "@/interfaces/schema.type";
import { SocketEmitEvent } from "@/interfaces/socket.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Socket } from "socket.io-client";

/* -------------------------------------------------------------------------- */
/*                                   SIDEBAR                                  */
/* -------------------------------------------------------------------------- */
export type SidebarStore = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  badgeCount: Record<string, number>;
};
export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
      badgeCount: {},
    }),
    {
      name: "sidebar-storage",
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

/* -------------------------------------------------------------------------- */
/*                                   SETTING                                  */
/* -------------------------------------------------------------------------- */
export type B2CConfig = {
  APP_FA_NAME: string;
  APP_LOGO: string;
  IS_MARKETPLACE: "0" | "1";
  BUSINESS_NAME: string;
  BUSINESS_ADDRESS: string;
  BUSINESS_LATITUDE: string;
  BUSINESS_LONGITUDE: string;
  HAS_MULTI_PRODUCT_ATTRIBUTE: "0" | "1";
  CAN_CREATE_ATTRIBUTE: "0" | "1";
  MAIN_ATTRIBUTE_GROUP: string;
  HAS_OFFER_CODE: "0" | "1";
  HAS_PAYMENT: "0" | "1";
  BANNER_POSITIONS: EnumList[];
  content_categories: ContentCategory[];
};

export type SettingStore = {
  setting: B2CConfig | null;
  setSetting: (data: B2CConfig) => void;
  sidebar: SidebarRowItem[];
  setSidebar: (data: SidebarRowItem[]) => void;
  muteNotifSound: boolean;
};
export const useSettingStore = create<SettingStore>()(
  persist(
    (set, get) => ({
      setting: null,
      setSetting: (data: B2CConfig) => set({ setting: data }),
      sidebar: [],
      setSidebar: (data: SidebarRowItem[]) => set({ sidebar: data }),
      muteNotifSound: true,
    }),
    {
      name: "setting-storage",
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

/* -------------------------------------------------------------------------- */
/*                                    AUTH                                    */
/* -------------------------------------------------------------------------- */
export type AuthStore = {
  adminInfo: Admin | null;
  setAdminInfo: (data: any) => void;
  adminAccess: AccessControlList[];
  setAdminAccess: (data: any) => void;
};
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      adminInfo: null,
      setAdminInfo: (data: any) => set({ adminInfo: data }),
      adminAccess: [],
      setAdminAccess: (data: any) => set({ adminAccess: data }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

/* -------------------------------------------------------------------------- */
/*                                   SOCKET                                   */
/* -------------------------------------------------------------------------- */
export type SocketStore = {
  socket: Socket | undefined;
  setSocket: (s: Socket) => void;
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
  alerts: Alert[];
  setNewAlert: (data: any) => void;
  setAlerts: (data: any) => void;
};
export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: undefined,
  setSocket: (s: Socket) => set({ socket: s }),
  isConnected: false,
  setIsConnected: (value: boolean) => set({ isConnected: value }),
  alerts: [],
  setNewAlert: (newAlert: Alert) =>
    set({
      alerts:
        get().alerts?.length < 15 ? [newAlert].concat(get().alerts) : [newAlert].concat(get().alerts?.slice(0, -1)),
    }),
  setAlerts: (data) => set({ alerts: data }),
}));

/* -------------------------------------------------------------------------- */
/*                                NOTIFICATION                                */
/* -------------------------------------------------------------------------- */

export type NotificationStore = {
  notifBadge: number;
  newNotif: null | SocketEmitEvent;
  newNotifRefresher: number;
  notifList: any[];
  onlyUnreadEmail: boolean;
  unreadEmailCount: number;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifBadge: 0,
  newNotif: null,
  newNotifRefresher: 0,
  notifList: [],
  onlyUnreadEmail: false,
  unreadEmailCount: 0,
}));
