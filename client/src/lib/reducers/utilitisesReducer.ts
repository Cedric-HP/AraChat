
import { createReducer } from "@reduxjs/toolkit"
import { Utilitise } from "../type/usersChatType"
import changeCurrenteRoomAction from "../action/UtilitisesActions/changeCurrenteRoomAction"

const initialState: Utilitise = {
    currentRoom: {
        id: -1,
        name: "Général"
    }
}

const utilitisesReducer = createReducer<Utilitise>(
    initialState,
    (builder) => {
        builder.addCase(changeCurrenteRoomAction, (state, action) => {
            state.currentRoom.id = action.payload.id
            state.currentRoom.name = action.payload.name
        })
    }
)


export default utilitisesReducer