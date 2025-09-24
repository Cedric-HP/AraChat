
import { createReducer } from "@reduxjs/toolkit"
import { RegisterRedux } from "../type/usersChatType"
import postRegisterAction from "../action/fetchUserData"

const initialState: RegisterRedux = {
    res: "",
    fetchState: ""
}

const postRegisterReducer = createReducer<RegisterRedux>(
    initialState,
    (builder) => {
        builder.addCase(postRegisterAction.fulfilled, (state, action) => {
            if (action.payload.res === "OK") {
                console.log("Bien Enregistré")
                state.fetchState = "done"
            }
            state.fetchState = "Error"
            state.res = action.payload.res
        }).addCase(postRegisterAction.pending, (state) => {
            state.fetchState = "fecthing"
        })
    }
)


export default postRegisterReducer