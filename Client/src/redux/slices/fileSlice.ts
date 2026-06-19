import { createSlice } from "@reduxjs/toolkit";
import { type IFileSlice } from "../types";

const fileSlice = createSlice({
    name: "file",
    initialState: {
        files: [],
        currentDir: null,
        dirStack: [],
        modal: false
    } as IFileSlice,
    reducers: {
        setFile: (state: IFileSlice, action) => {
            state.files = action.payload
        },
        getDir: (state: IFileSlice, action) => {
            state.currentDir = action.payload
        },
        dirStack: (state: IFileSlice, action) => {
            if (!state.dirStack) {
                state.dirStack = []
            }
            state.dirStack.push(action.payload)
        },
        modal: (state: IFileSlice, action) => {
            state.modal = action.payload
        }
    }
})

export const { setFile, getDir, dirStack, modal } = fileSlice.actions
export default fileSlice.reducer