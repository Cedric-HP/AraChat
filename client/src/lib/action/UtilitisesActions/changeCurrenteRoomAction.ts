import { ChannelPublic } from "@/lib/type/usersChatType";
import { createAction } from "@reduxjs/toolkit";



const changeCurrenteRoomAction = createAction<ChannelPublic>("UTILITISES-REDUCER/changeCurrenteRoom");

export default changeCurrenteRoomAction;