import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfilPublic, ApiToken, ChannelPublic, ChannelPublicList, ChannelData, Message } from "../type/usersChatType";
import postRegisterAction from "../action/postRegister";
import fetchUserDataAction from "../action/fetchUserData";
import fetchProfile from '../action/fetchProfile';
import fetchChannelsListAction from "../action/fetchChannelsList";
import setStatusToIdleAction from "../action/setStatusToIdle";
import fetchChannelsDataAction from "../action/fetchChannelDataAction";
import fetchCreateChannelAction from "../action/postCreateChannelAction";
import postAddMemberToChannelAction from "../action/postAddMemberToChannelAction";
import postMessageAction from "../action/postMessageAction";
import fetchProfileByIdAction from "../action/fetchProfileById";

interface AuthState {
  user: ProfilPublic | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  channelList: ChannelPublic[];
  currentChannelData: ChannelData;
  usersProfilList: ProfilPublic[];
}

const initialState: AuthState = {
  user: null,
  token: 
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null, // On récup le token au démarrage ;)
  status: "idle",
  error: null,
  channelList: [],
  currentChannelData: {
    id: -1,
    name: "",
    owner_id: null,
    desc: "",
    members: [],
    messagelogs: [],
  },
  usersProfilList: []
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
      // Set Status to idle -------------------------------------------------
      .addCase(setStatusToIdleAction, (state)=>{
        state.status = "idle"
      })

      // Register Case -------------------------------------------------
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

      // Login Case -------------------------------------------------
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

      // Get Profil Case -------------------------------------------------
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

      // Get Profil By Id Case -------------------------------------------------
      .addCase(fetchProfileByIdAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProfileByIdAction.fulfilled,
        (state, action: PayloadAction<ProfilPublic>) => {
          state.status = "succeeded";
          state.usersProfilList.push(action.payload)
        }
      )
      .addCase(fetchProfileByIdAction.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Impossible de charger le profile de l'utilisateur.";
      })

      // Get Channel List Case -------------------------------------------------
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
      })

      // Get Channel Data By Id Case -------------------------------------------------
      .addCase(fetchChannelsDataAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchChannelsDataAction.fulfilled,
        (state, action: PayloadAction<ChannelData>) => {
          state.status = "succeeded";
          state.currentChannelData = action.payload;
        }
      )
      .addCase(fetchChannelsDataAction.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Impossible de charger les détails du channel";
      })

      // Post Create Channel Case -------------------------------------------------
      .addCase(fetchCreateChannelAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCreateChannelAction.fulfilled,
        (state, action: PayloadAction<ChannelPublic>) => {
          state.status = "succeeded";
          state.channelList.push(action.payload);
        }
      )
      .addCase(fetchCreateChannelAction.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Impossible de charger les détails du channel";
      })

      // Post Add Member To Channel By Id Case -------------------------------------------------
      .addCase(postAddMemberToChannelAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postAddMemberToChannelAction.fulfilled,
        (state, action: PayloadAction<ChannelData>) => {
          state.status = "succeeded";
          state.currentChannelData = action.payload;
        }
      )
      .addCase(postAddMemberToChannelAction.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Impossible de charger les détails du channel";
      })

      // Post Add Message To Channel By Id Case -------------------------------------------------
      .addCase(postMessageAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postMessageAction.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.status = "succeeded";
          state.currentChannelData.messagelogs.push(action.payload);
        }
      )
      .addCase(postMessageAction.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message ||
          "Impossible de charger les détails du channel";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
