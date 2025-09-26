
import { createReducer } from "@reduxjs/toolkit"
import { Utilitise } from "../type/usersChatType"
import displayLogRegAction from "../action/UtilitisesActions/displayDropDownAction"
import firstFetchChannelAction from "../action/UtilitisesActions/firstFetchChannelAction"

const initialState: Utilitise = {
    dropDown: "",
    firstFetchChannel: false
}

const utilitisesReducer = createReducer<Utilitise>(
    initialState,
    (builder) => {
        builder.addCase(displayLogRegAction, (state, action) => {
            state.dropDown = action.payload
        }).addCase(firstFetchChannelAction, (state) => {
            state.firstFetchChannel = true
        })
    }
)


export default utilitisesReducer