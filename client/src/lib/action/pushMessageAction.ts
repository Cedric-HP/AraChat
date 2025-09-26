import { Message } from "@/lib/type/usersChatType";
import { createAction } from "@reduxjs/toolkit";



const pushMessageAction = createAction<Message>("auth/pushMessage");

export default pushMessageAction;