import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProfilPublic } from "../type/usersChatType";
import { authFetch } from "../api";
const fetchProfileByIdAction = createAsyncThunk<ProfilPublic, number>(
  "auth/fetchProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/profils/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default fetchProfileByIdAction;
