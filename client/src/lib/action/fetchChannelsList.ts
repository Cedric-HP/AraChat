import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelPublicList } from "../type/usersChatType";
import { authFetch } from "../api";

const fetchChannelsListAction = createAsyncThunk<ChannelPublicList, void>(
  "auth/fetchChannelsList",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authFetch("/channels/");
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default fetchChannelsListAction;
