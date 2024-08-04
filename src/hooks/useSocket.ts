import { ACCESS_TOKEN_KEY } from "@/redux/slices/authSlice";
import { socketService } from "@/services/socketService";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
      return;
    }
    const socket = socketService.initialize(dispatch);

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};
