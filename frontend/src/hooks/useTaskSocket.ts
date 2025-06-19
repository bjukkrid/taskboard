import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useTaskSocket(onTaskEvent: () => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    socketRef.current = socket;
    socket.on("task:create", onTaskEvent);
    socket.on("task:move", onTaskEvent);
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
