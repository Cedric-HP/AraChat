import { Channel } from "@/lib/type/usersChatType";
import { createAction } from "@reduxjs/toolkit";



const changeCurrenteRoomAction = createAction<Channel>("UTILITISES-REDUCER/changeCurrenteRoom");

export default changeCurrenteRoomAction;