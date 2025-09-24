import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiToken, FetchUserDataPaylaod } from "../type/usersChatType";

const fetchUserDataAction = createAsyncThunk<ApiToken, FetchUserDataPaylaod>(
  "USERS-CHAT-REDUCER/fetchUserData",
  async ({ name, password }) => {
    console.log({
      name: name,
      password: password,
    });
    try {
      const formBody = new URLSearchParams();
      formBody.append("username", name);
      formBody.append("password", password);

      const res = await fetch(`http://localhost:8000/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Http error. status: ${res.status}`);
      }

      const data: ApiToken = await res.json();
      localStorage.setItem("authToken", data.access_token);
      return data;
    } catch (err) {
      console.error(err);
      localStorage.removeItem("authToken");
      throw err;
    }
  }
);
export default fetchUserDataAction;
