import axios from "axios";

import { ACCESS_TOKEN } from "../constants";

export async function postLogin(loginInfo) {
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_LOCAL_SERVER_URL}/api/auth/login`,
      loginInfo,
      {
        withCredentials: true,
      }
    );

    localStorage.setItem(ACCESS_TOKEN, data.data.accessToken);

    return data.data.user;
  } catch (err) {
    throw new Error("로그인에 실패하였습니다.");
  }
}

export async function postSignup(formData) {
  const res = await axios.post(
    `${process.env.REACT_APP_LOCAL_SERVER_URL}/api/auth/signup`,
    formData,
    {
      header: { "content-type": "multipart/form-data" },
      withCredentials: true,
    }
  );

  return res;
}

export async function checkSignupInfo(signupInfo) {
  const res = await axios.post(
    `${process.env.REACT_APP_LOCAL_SERVER_URL}/api/auth/signup/check`,
    signupInfo,
    {
      withCredentials: true,
    }
  );

  return res;
}
