
import { createReducer } from "@reduxjs/toolkit"
import { UserRedux } from "../type/usersChatType"
import fetchUserDataAction from "../action/fetchUserData"

const initialState: UserRedux = {
    user: {
        res: "",
        tokenData: {
            id: 0,
            token: ""
        },
        channelList: [],
    },
    currentChannel: {
        desc: "For Everyone",
        owner: -1,
        authoriseUserList: [-1],
        messageLog: []
    },
    fetchState: ""
}

const fetchUserDataReducer = createReducer<UserRedux>(
    initialState,
    (builder) => {
        builder.addCase(fetchUserDataAction.fulfilled, (state, action) => {
            if (action.payload.res === "OK") {
                state.user.tokenData = action.payload.tokenData
                state.user.channelList = action.payload.channelList.map((item)=> {
                    return {
                        ...item
                }})
                state.fetchState = "done"
            }
            state.fetchState = "Error"
            state.user.res = action.payload.res
        }).addCase(fetchUserDataAction.pending, (state) => {
            state.fetchState = "fecthing"
        })
    }
)


export default fetchUserDataReducer