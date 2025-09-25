import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelCreate, ChannelPublic } from "../type/usersChatType";

const fetchCreateChannelAction = createAsyncThunk<ChannelPublic, ChannelCreate>(
  "auth/postCreateChannels",
  async ({name, desc}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("Aucun token d'authentification trouvé");
      }
        const formBody = new URLSearchParams();
        formBody.append("name", name);
        formBody.append("desc", desc || "");

        const res = await fetch(`http://localhost:8000/channels/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formBody.toString(),
      });

      if (!res.ok) {
        const errorData = await res.json();

        return rejectWithValue(
          errorData.detail || `Http error. status: ${res.status}`
        );
      }

      const data: ChannelPublic = await res.json();
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

export default fetchCreateChannelAction;