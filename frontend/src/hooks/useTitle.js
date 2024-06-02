import { useEffect } from "react"

export default function useTitle(title) {
    useEffect(() => {
        const originalTitle = document.title
        document.title = title
        return function () {
            document.title = originalTitle
        }
    }, [title])
}
