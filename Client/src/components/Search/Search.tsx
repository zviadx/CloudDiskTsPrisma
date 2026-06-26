import {useCallback, useState} from 'react';
import {useDebounce} from "../../hooks/useDebounce.js";
import {searchFile} from "../../tools/searchFile.ts";
import {useDispatch} from "react-redux";
import type { AppDispatch } from '../../redux/store.ts';

const Search = () => {
    const [doSearch, setDoSearch] = useState('')
    const dispatch: AppDispatch = useDispatch()
    const search = async (value: string) => {
        await dispatch(searchFile(value))
    }
    const DebouncedSearch = useDebounce({ callBack: search, delay: 500 })


    const setSearchTimeout = useCallback((e) => {
        const value = e.target.value
        setDoSearch(value)
        DebouncedSearch(value)
    },[DebouncedSearch])

    return (
        <div
            id="search-container"
            contentEditable
            className="ml-8 px-4 py-2 border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500 outline-none text-gray-700 w-[300px] relative flex items-center"
            role="textbox"
            suppressContentEditableWarning={true}
        >
            <svg width="1em" height="1em" viewBox="0 0 20 20"
                 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none z-10
                         align-middle me-3 text-gray-30 shrink-0 group-betterhover:hover:text-gray-70">
                <path
                    d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                    stroke="currentColor" fill="none" strokeWidth="2" fillRule="evenodd"
                    strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <input
                className="ml-4 pl-1 w-full h-full focus:outline-0"
                onChange={setSearchTimeout}
                value={doSearch}
            />
        </div>
    );
};

export default Search;