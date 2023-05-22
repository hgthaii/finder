import React, { useEffect, useState } from 'react'

const useDebounce = (value, delay) => {
    const [deboucne, setDebounce] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounce(value)
        }, delay)
        return () => clearTimeout(handler)
    }, [value])

    return deboucne
}

export default useDebounce
