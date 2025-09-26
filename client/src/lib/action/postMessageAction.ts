import { createAsyncThunk } from "@reduxjs/toolkit";
import { Message, MessageAdd } from "../type/usersChatType";
import { authFetch } from "../api";

const postMessageAction = createAsyncThunk<Message, MessageAdd>(
  "auth/postMessage",
  async ({ channel_id, message }, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/channels/${channel_id}/messages`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default postMessageAction;
