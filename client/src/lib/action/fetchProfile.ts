import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProfilPublic } from "../type/usersChatType";
import { authFetch } from "../api";

const fetchProfileAction = createAsyncThunk<ProfilPublic, void>(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authFetch("/profils/me");
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default fetchProfileAction;
