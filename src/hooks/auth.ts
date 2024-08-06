import { refreshToken } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import type { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAuthRefresh = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, refreshToken: refreshTokenValue } = useSelector(
    (state: RootState) => state.auth,
  );
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startRefreshInterval = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      refreshIntervalRef.current = setInterval(
        () => {
          dispatch(refreshToken());
        },
        5 * 60 * 1000,
      ); // 5 minutes
    };

    if (accessToken && refreshTokenValue) {
      startRefreshInterval();
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [accessToken, refreshTokenValue, dispatch]);
};
