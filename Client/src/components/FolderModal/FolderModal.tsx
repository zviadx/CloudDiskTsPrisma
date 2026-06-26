import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createFolder } from "../../tools/createFolder";
import { setModal } from "../../redux/slices/fileSlice";
import type { RootState, AppDispatch } from "../../redux/store";


const FolderModal = () => {
    const [inputValue, setInputValue] = useState<string>('')
    const currentFolderId = useSelector((state: RootState) => state.file.currentDir)
    const authModal = useSelector((state: RootState) => state.file.modal)
    const dispatch = useDispatch<AppDispatch>()

    async function keyPressHandler(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            await dispatch(createFolder(inputValue, currentFolderId))
            setInputValue("")
            dispatch(setModal(false))
        }
    }

    async function clickHandler() {
        await dispatch(createFolder(inputValue, currentFolderId))
        setInputValue("")
    }

    return (
    <div
        onClick={() => {
            dispatch(setModal(false))
        }}
        className={
            authModal
                ? "fixed left-0 top-0 w-screen h-screen bg-black/50 flex items-center justify-center"
                : "hidden"
            }
    >

        <div
            className="relative w-[400px] h-[200px] bg-white rounded-[15px] flex flex-col items-center justify-center"
            onClick={event => event.stopPropagation()}
        >
            <input
                // className="w-[300px] h-[30px] border-0 border-b-[3px] border-b-[#566885] outline-none p-[5px]"
                className="absolute w-[200px] mt-[-50px] border-t-0 border-b-[3px] border-b-teal-500 outline-none"
                placeholder="Enter Folder Name"
                type="text"
                value = {inputValue}
                onChange={event => setInputValue(event.target.value)}
                onKeyDown = {(event) => keyPressHandler(event)}

            />
                <button
                    // className="w-[100px] h-[30px] mt-[10px] bg-[#4b78ea] text-white rounded-[5px] cursor-pointer"
                    className="absolute w-[60px] ml-[-140px] mt-[70px] rounded-[5px] border-2 border-teal-500"
                        onClick={event => {
                            event.stopPropagation()
                            clickHandler().then(() => {
                                dispatch(setModal(false))
                            })
                        }}
                >
                    accept
                </button>

        </div>

    </div>
    )
};

export default FolderModal;