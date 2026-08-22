import { SocketEmitEvent, SocketEvents } from "@/interfaces/socket.type";
import {
  SocketStore,
  useAuthStore,
  useNotificationStore,
  useSettingStore,
  useSocketStore,
} from "@/store";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Howl } from "howler";

export const SocketIO = () => {
  const { isConnected, setIsConnected, setNewAlert, setSocket } =
    useSocketStore((state: SocketStore) => state);
  const adminInfo = useAuthStore((state) => state.adminInfo);

  useEffect(() => {
    if (isConnected) return;
    if (!adminInfo) return;

    const socketToken = localStorage.getItem("socket_token");
    if (!socketToken) return;

    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
      transports: ["websocket"],
      auth: {
        token: socketToken,
      },
    });

    setSocket(socket);

    socket.on("client-connected", (e) => {
      console.log("clientConnected", e);
      setIsConnected(true);
    });

    socket.on(SocketEvents.NEW_NOTIFICATION, (data: SocketEmitEvent) => {
      useNotificationStore.setState({
        newNotifRefresher: Math.random(),
        newNotif: data,
      });
      !useSettingStore.getState().muteNotifSound && playAudio();
    });

    /* ----------------------------- ERROR HANDLING ---------------------------- */
    socket.on("connect_error", (error) => {
      console.log("socket error", error);
      setIsConnected(false);
      socket?.connect();
    });

    socket.on("disconnect", (e) => {
      console.log("diss", e);
      setIsConnected(false);
    });
  }, [adminInfo, isConnected]);

  function playAudio() {
    try {
      const sound = new Howl({
        src: ["/assets/sounds/notification.mp3"],
      });
      sound.play();
    } catch (error) {
      console.log({ error });
    }
  }
};
