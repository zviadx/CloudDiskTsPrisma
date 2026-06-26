import axios from "axios"
import {getFiles} from "./getFiles"
import {changeProgress, filesStore} from "../redux/slices/uploadSlice"
import type { AppDispatch } from "../redux/store"


export const upFile = (file: File, dirId?: string) => async (dispatch: AppDispatch) => {
    try {
        const formData = new FormData()
        formData.append("file", file)
        if (dirId) { formData.append("parent", dirId) }

        const upFile = {name: file.name, progress: 0, id: Date.now()}
        dispatch(filesStore(upFile))

        await axios.post('http://localhost:5555/api/files/uploader'
            , formData
            , {
                headers: {authorization: `Bearer ${localStorage.getItem('token')}`}

                , onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.total || file.size;
                    if (totalLength) {
                        upFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        // console.log(`Is ${upFile.progress}`)
                        dispatch(changeProgress(upFile))
                    }
                }

            }
        )
            .then(response => {
                dispatch(getFiles(response.data.parent))

            })
    } catch (e) {
        console.error(e)
    }

}