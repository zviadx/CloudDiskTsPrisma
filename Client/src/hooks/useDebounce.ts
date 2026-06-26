import { useCallback, useRef } from "react";

type TPropTypes = {
    callBack: (...args: string[]) => void,
    delay: number
}

export function useDebounce({ callBack, delay }: TPropTypes) {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    return useCallback((...args: string[]) => {
        if (timeout) {
            clearTimeout(timeout.current)
        }

        timeout.current = setTimeout(() => { callBack(...args) }, delay)
    }, [callBack, delay])
}