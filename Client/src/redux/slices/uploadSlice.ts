import { createSlice } from "@reduxjs/toolkit";
import { type IUploadSlice, type IUploadFiles } from "../types";


const uploadSlice = createSlice({
    name: 'upload',
    initialState: {
        isVisible: false,
        files: [{
            id: 0,
            progress: 0,
            name: ""
        }]
    } as IUploadSlice,
    reducers: {
        filesStore: (state: IUploadSlice, action: { payload: IUploadFiles }) => {
            state.files?.push(action.payload)
        },
        makeVisible: (state: IUploadSlice, action: { payload: boolean }) => {
            state.isVisible = action.payload
        },
        changeProgress: (state: IUploadSlice, action: { payload: IUploadFiles }) => {
            const file = state.files.find(f => f.id === action.payload.id)
            if (file) file.progress = action.payload.progress
        },
        removeItem: (state: IUploadSlice, action: {payload: IUploadFiles}) => {
            state.files.filter(f => f.id !== action.payload.id)
        }

    }
    
})

export const { filesStore, makeVisible, changeProgress, removeItem } = uploadSlice.actions;
export default uploadSlice.reducer
