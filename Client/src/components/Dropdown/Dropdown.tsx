import { useEffect, useRef, useState } from 'react';
import "./Dropdown.css";
import { NavLink } from "react-router-dom";
// import { type IDropdownItems } from '../Navbar/consts';

type TItemType = {
    text: string,
    icon?: string,
    link?: string, 
    onClick: () => void
}

type TDropdown = {
    trigger: React.ReactNode,
    items: TItemType[]
}


const Dropdown = ({ trigger, items }: TDropdown) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                console.log(dropdownRef.current)
                console.log(event.target)
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="dropdown-trigger" onClick={toggleDropdown}>
                {trigger}
            </div>

            {isOpen && (
                <ul className="absolute top-full w-max shadow-lg py-2 ml-[-100px] mr-auto
                border-2 border-black rounded-md bg-white">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false);
                            }}
                        >
                            {item.icon && <img src={item.icon} alt="" className="dropdown-item-icon w-5 h-5 mr-2" />}
                            {item.link ? (
                                <NavLink className="no-underline text-black" to={item.link}>
                                    {item.text}
                                </NavLink>
                            ) : (
                                <span className="text-black cursor-pointer">{item.text}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
