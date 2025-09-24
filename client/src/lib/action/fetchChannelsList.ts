import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChannelPublicList } from "../type/usersChatType";

const fetchChannelsListAction = createAsyncThunk<ChannelPublicList, void>(
  "auth/fetchChannelsList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("Aucun token d'authentification trouvé");
      }

      const res = await fetch(`http://localhost:8000/channels/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        return rejectWithValue(
          errorData.detail || `Http error. status: ${res.status}`
        );
      }

      const data: ChannelPublicList = await res.json();
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

export default fetchChannelsListAction;