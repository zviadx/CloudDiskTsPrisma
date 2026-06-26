import SelectIcon from "../../assets/img/selectcol.svg";
import LogOut from "../../assets/img/logoutcol.svg";
import { logOut } from "../../redux/slices/userSlice";
import { type AppDispatch } from "../../redux/store";

export interface IDropdownItems {
    text: string,
    icon?: string,
    link?: string,
    onClick: () => void
}

export const dropdownItems = (dispatch: AppDispatch): IDropdownItems[] => {
    return ( [
        {
            text: "Choose Avatar",
            icon: SelectIcon,
            link: "/Profile",
            onClick: () => console.log("Option Avatar clicked")
        },
        {
            text: "Sign Out",
            icon: LogOut,
            link: undefined,
            onClick: () => {
                dispatch(logOut())
                localStorage.removeItem("token")
            }
        }
    ]
) }