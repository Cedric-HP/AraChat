import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelData, MemberAdd } from "../type/usersChatType";
import { authFetch } from "../api";

const postAddMemberToChannelAction = createAsyncThunk<ChannelData, MemberAdd>(
  "auth/postAddMemberToChannel",
  async ({ id, user_id }, { rejectWithValue }) => {
    try {
      const data = await authFetch(`channels/${id}/members`, {
        method: "POST",
        body: JSON.stringify({ profil_id: user_id }),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default postAddMemberToChannelAction;
