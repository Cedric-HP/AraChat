import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelData, MemberAdd} from "../type/usersChatType";

const postAddMemberToChannelAction = createAsyncThunk<ChannelData, MemberAdd>(
  "auth/postAddMemberToChannel",
  async ({id, user_id}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("Aucun token d'authentification trouvé");
      }
      const res = await fetch(`http://localhost:8000/channels/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: 
            JSON.stringify({
                "profil_id": user_id
            }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        return rejectWithValue(
          errorData.detail || `Http error. status: ${res.status}`
        );
      }

      const data: ChannelData = await res.json();
      return data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(
        err.message ||
          "Une erreur inconnue est survenue lors de la récupération du profil"
      );
    }
  }
);

export default postAddMemberToChannelAction;