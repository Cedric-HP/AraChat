import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelData } from "../type/usersChatType";
import { authFetch } from "../api";

const fetchChannelsDataAction = createAsyncThunk<ChannelData, number>(
  "auth/fetchChannelsData",
  async (id, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/channels/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default fetchChannelsDataAction;
