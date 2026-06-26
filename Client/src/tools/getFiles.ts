import axios from "axios"
import { setFile } from "../redux/slices/fileSlice";
import type { AppDispatch } from "../redux/store";


export const getFiles = (dirId: string, sort?: string | undefined) => async (dispatch: AppDispatch) => {
    try {
        let url = `http://localhost:5555/api/files`
        if (dirId) {
            url = `http://localhost:5555/api/files?parent=${dirId}`
        }
        if (sort) {
            url = `http://localhost:5555/api/files?sort=${sort}`
        }
        if (dirId && sort) {
            url = `http://localhost:5555/api/files?parent=${dirId}&sort=${sort}`
        }

        await axios.get(url, {
            headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(response => {
                dispatch(setFile(response.data))
            })

    } catch (e) {
        console.error(e)
    }

}