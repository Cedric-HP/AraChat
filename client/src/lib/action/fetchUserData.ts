import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchUserDataPaylaod } from "../type/usersChatType";

const fetchUserDataAction = createAsyncThunk<boolean, FetchUserDataPaylaod>(
  "auth/fetchUserData",
  async ({ name, password }, { rejectWithValue }) => {
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
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Http error. status: ${res.status}`);
      }

      
      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export default fetchUserDataAction;
