import axios from "axios";
import { getFiles } from "./getFiles";
import { type AppDispatch } from "../redux/store";


export const createFolder = (folder: string, parentFolderId: string | null) => async(dispatch: AppDispatch) => {
    try {
        await axios.post('http://localhost:5555/api/files/createFolder',
            {folder: folder, parentFolderId: parentFolderId},
            {headers: {authorization: `Bearer ${localStorage.getItem('token')}`}})
            .then(res => {
                if (res.status === 200) {
                    dispatch(getFiles(res.data.Folder.parent))
                }
            } )
    } catch (error) {
        alert(error.message)
    }
}