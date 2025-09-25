import { createAsyncThunk } from "@reduxjs/toolkit";
import { Message, MessageAdd} from "../type/usersChatType";

const postMessageAction = createAsyncThunk<Message, MessageAdd>(
  "auth/postMessage",
  async ({channel_id, message}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("Aucun token d'authentification trouvé");
      }
      const res = await fetch(`http://localhost:8000/channels/${channel_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: 
            JSON.stringify({
                "message": message
            }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        return rejectWithValue(
          errorData.detail || `Http error. status: ${res.status}`
        );
      }

      const data: Message = await res.json();
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

export default postMessageAction;