import logo from "../../assets/img/navbar-logo.svg"
import {NavLink} from "react-router-dom";
import {getDir, setModal} from "../../redux/slices/fileSlice";
import {useDispatch, useSelector} from "react-redux"
import Avatar from "../../assets/img/avatar.svg"
import UpArrow from "../../assets/img/upcol-com.svg"
import Folder from "../../assets/img/icons8-opened-folder.svg"
import {SERVER_URL} from "../../config.ts";
import FolderModal from "../FolderModal/FolderModal";
import Dropdown from "../Dropdown/Dropdown.tsx";
import Login from "../../assets/img/login.svg"
import AddUser from "../../assets/img/user-add1.svg"
import File from "../../assets/img/filecol.svg";
import {makeVisible} from "../../redux/slices/uploadSlice";
import {upFile} from "../../tools/uploadFile.ts";
import {dropdownItems} from "./consts.ts";
import Search from "../Search/Search.tsx";
import type { RootState, AppDispatch } from "../../redux/store.ts";


const Navbar = () => {
    const isAuth = useSelector((state: RootState) => state.user.isAuth)
    const stack = useSelector((state: RootState) => state.file.dirStack)
    const currDir = useSelector((state: RootState) => state.file.currentDir)
    const currUser = useSelector((state: RootState) => state.user.currentUser)
    const dispatch = useDispatch<AppDispatch>()
    const authModal = useSelector((state: RootState) => state.file.modal)

    // const files = useSelector<RootState>(state => state.file)


    function failUpload(event) {
        const upFiles = [...event.target.files]
        upFiles.forEach((file) => dispatch(upFile(file, file.currentDir)))
    }

    return (
        <div className="w-full h-[50px] flex items-center justify-between px-5 py-0 border-b-[3px] border-b-[blue] border-solid;">
            <div className="flex items-center;">
                <img src={logo} alt="" className="mr-[15px]"/>
                <div className="text-2xl font-bold">MERN CLOUD</div>

                <Search />

            </div>

            {!isAuth
                ?
                <div className="flex items-center gap-4">
                    <div className="mr-4"><NavLink to="/login">
                        <img src={`${Login}`} alt="" className="mr-[15px]"/>
                    </NavLink></div>
                    <div className="mr-4"><NavLink to="/registration">
                        <img src={`${AddUser}`} alt="" className="mr-[15px]"/>
                    </NavLink></div>
                </div>
                :
                <div className="flex items-center gap-4">


                    <label htmlFor="fileUpload" className="ml-[50px] px-[10px] py-[5px] cursor-pointer">
                        {
                            <img
                                src={File} alt=""
                                onClick={() => dispatch(makeVisible(true))}
                            />
                        }
                    </label>
                    <input type="file" multiple={true} id="fileUpload" className="hidden"
                           onChange={(event) => failUpload(event)}
                    />

                    <img src={Folder} alt=""
                         className="w-[45px] h-[35px] rounded-lg bg-white cursor-pointer active:translate-x-px
                         active:translate-y-px"
                         onClick={() => {
                             dispatch(setModal(true))
                         }}
                    />

                    {authModal && <FolderModal/>}

                    <NavLink
                        to={`/disk?dir=${currDir}`}
                        style={({isActive}) => ({
                            color: isActive ? "#4b78ea" : "black"
                        })}
                    >
                        <img
                            src={`${UpArrow}`} alt=""
                            onClick={() => {
                                if (stack && stack.length > 0) {
                                    const popped = [...stack].pop()
                                    dispatch(getDir(popped))
                                }
                            }}
                        />
                    </NavLink>

                    <Dropdown
                        trigger={
                            <img
                                src={currUser.avatar ? `${SERVER_URL + "fail.svg"}` : `${Avatar}`} alt=""
                                className="w-10 h-10 rounded-lg bg-white cursor-pointer ml-[1px] mr-20"
                            />
                        }
                        items={dropdownItems(dispatch)}
                    />


                </div>
            }

        </div>
    );
};

export default Navbar;