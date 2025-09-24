
import { createReducer } from "@reduxjs/toolkit"
import { Utilitise } from "../type/usersChatType"
import changeCurrenteRoomAction from "../action/UtilitisesActions/changeCurrenteRoomAction"
import displayLogRegAction from "../action/UtilitisesActions/displayLogRegAction"
import firstFetchChannelAction from "../action/UtilitisesActions/firstFetchChannelAction"

const initialState: Utilitise = {
    currentRoom: {
        id: -1,
        name: "",
        owner: null,
        desc: ""
    },
    logReg: false,
    firstFetchChannel: false
}

const utilitisesReducer = createReducer<Utilitise>(
    initialState,
    (builder) => {
        builder.addCase(changeCurrenteRoomAction, (state, action) => {
            state.currentRoom = action.payload
        }).addCase(displayLogRegAction, (state) => {
            state.logReg = !state.logReg
        }).addCase(firstFetchChannelAction, (state) => {
            state.firstFetchChannel = true
        })
    }
)


export default utilitisesReducer