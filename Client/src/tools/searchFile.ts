import axios from "axios"
import {setFile} from "../redux/slices/fileSlice";
import type { AppDispatch } from "../redux/store";


export const searchFile = (name: string) => async (dispatch: AppDispatch) => {
    try {
        await axios.get(`http://localhost:5555/api/files/search?name=${name}`, {
            headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(response => {
                dispatch(setFile(response.data))
                // dispatch(getDir(response.data.parent))
            })

    } catch (e) {
        console.error(e)
    }

}