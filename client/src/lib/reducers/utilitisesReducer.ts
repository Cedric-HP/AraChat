
import { createReducer } from "@reduxjs/toolkit"
import { Utilitise } from "../type/usersChatType"
import displayLogRegAction from "../action/UtilitisesActions/displayLogRegAction"
import firstFetchChannelAction from "../action/UtilitisesActions/firstFetchChannelAction"

const initialState: Utilitise = {
    logReg: false,
    firstFetchChannel: false
}

const utilitisesReducer = createReducer<Utilitise>(
    initialState,
    (builder) => {
        builder.addCase(displayLogRegAction, (state) => {
            state.logReg = !state.logReg
        }).addCase(firstFetchChannelAction, (state) => {
            state.firstFetchChannel = true
        })
    }
)


export default utilitisesReducer