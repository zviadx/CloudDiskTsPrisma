import { createSlice } from "@reduxjs/toolkit";
import { type IUserSlice } from "../types";


const userSlice = createSlice({
    name: 'user',
    initialState: { currentUser: {}, isAuth: false } as IUserSlice,
    reducers: {
        getUser: (state: IUserSlice, action) => {
            state.currentUser = action.payload
            state.isAuth = true
        },
        logOut: (state: IUserSlice) => {
            state.currentUser = {}
            state.isAuth = false
        }
    }
})

export const { getUser, logOut } = userSlice.actions
export default userSlice.reducer