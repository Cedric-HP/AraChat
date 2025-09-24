import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProfilPublic, ApiToken, ChannelPublic, ChannelPublicList } from "../type/usersChatType";
import postRegisterAction from "../action/postRegister";
import fetchUserDataAction from "../action/fetchUserData";
import fetchProfile from '../action/fetchProfile';
import fetchChannelsListAction from "../action/fetchChannelsList";
import setStatusToIdleAction from "../action/setStatusToIdle";

interface AuthState {
  user: ProfilPublic | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  channelList: ChannelPublic[]
}

const initialState: AuthState = {
  user: null,
  token: 
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null, // On récup le token au démarrage ;)
  status: "idle",
  error: null,
  channelList: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(setStatusToIdleAction, (state)=>{
        state.status = "idle"
      })
      .addCase(postRegisterAction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(postRegisterAction.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Inscription réussie pour :", action.payload.name);
      })
      .addCase(postRegisterAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Échec de l'inscription";
      })
      .addCase(fetchUserDataAction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUserDataAction.fulfilled,
        (state, action: PayloadAction<ApiToken>) => {
          state.status = "succeeded";
          state.token = action.payload.access_token;
        }
      )
      .addCase(fetchUserDataAction.rejected, (state, action) => {
        state.status = "failed";
        state.token = null;
        state.user = null;
        state.error = action.error.message || "Échec de la connexion";
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<ProfilPublic>) => {
          state.status = "succeeded";
          state.user = action.payload;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        localStorage.removeItem("authToken");
        state.error =
          action.error.message ||
          "Impossible de charger le profile de l'utilisateur.";
      })
      .addCase(fetchChannelsListAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchChannelsListAction.fulfilled,
        (state, action: PayloadAction<ChannelPublicList>) => {
          state.status = "succeeded";
          state.channelList = action.payload;
        }
      )
      .addCase(fetchChannelsListAction.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Impossible de charger les channels";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
