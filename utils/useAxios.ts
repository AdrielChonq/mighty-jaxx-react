import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../slices";
import { logout, updateToken } from "../slices/authSlice";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { useToast } from "@chakra-ui/react";

const useAxios = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (accessToken && req.headers) {
      req.headers["x-access-token"] = accessToken;

      const jwtToken: types.IJWTDeCode = jwtDecode(accessToken);
      const isExpired = moment().isAfter(moment.unix(jwtToken.exp));

      if (!isExpired) return req;

      try {
        const _response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`,
          null,
          {
            headers: {
              "x-refresh-token": refreshToken,
            },
          }
        );

        dispatch(
          updateToken({
            refreshToken: _response.data.refreshToken,
            accessToken: _response.data.accessToken,
          })
        );

        req.headers["x-access-token"] = _response.data.accessToken;
        return req;
      } catch (err) {
        if (err instanceof AxiosError) {
          // refresh token expired
          if (err?.response?.status === 401) {
            console.log("req", req);
            if (accessToken) {
              toast({
                title: `Session Expired`,
                description: "Please login again.",
                position: "top",
                status: "warning",
                isClosable: true,
              });
            } else {
              toast({
                title: `Unauthorized Access`,
                description: "Please login your account.",
                position: "top",
                status: "error",
                isClosable: true,
              });
            }
            dispatch(logout());
          }

          return Promise.reject(err?.response?.data);
        }
      }

      return req;
    }

    return req;
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      console.log(err.code);
      if (err.response) {
        if (
          err.response.status === 401 &&
          err.config.url !== "/api/auth/signin"
        ) {
          if (accessToken) {
            toast({
              title: `Session Expired`,
              description: "Please login again.",
              position: "top",
              status: "warning",
              isClosable: true,
            });
          } else {
            toast({
              title: `Unauthorized Access`,
              description: "Please login your account.",
              position: "top",
              status: "error",
              isClosable: true,
            });
          }
          dispatch(logout());
        }

        return Promise.reject(err.response.data);
      } else if (err.code) {
        toast({
          title: `Something went wrong`,
          description: err.code,
          position: "top",
          status: "error",
          isClosable: true,
        });

        return Promise.reject("");
      }

      return Promise.reject(err);
    }
  );

  return axiosInstance;
};

export default useAxios;
