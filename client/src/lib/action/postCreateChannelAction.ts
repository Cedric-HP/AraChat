import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelCreate, ChannelPublic } from "../type/usersChatType";
import { authFetch } from "../api";

const fetchCreateChannelAction = createAsyncThunk<ChannelPublic, ChannelCreate>(
  "auth/postCreateChannels",
  async ({ name, desc }, { rejectWithValue }) => {
    try {
      const data = await authFetch("/channel/", {
        method: "POST",
        body: JSON.stringify({name, desc})
      });
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default fetchCreateChannelAction;
