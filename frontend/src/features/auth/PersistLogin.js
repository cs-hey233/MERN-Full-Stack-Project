import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import usePersist from "../../hooks/usePersist";

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [refreshSuccess, setRefreshSuccess] = useState(false)
    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

    useEffect(() => {
        if (!effectRan.current) {
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    await refresh()
                    setRefreshSuccess(true)
                } catch (err) {
                    console.error(err)
                    console.log(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let content
    if (!persist) {
        content = <Outlet />
    } else if (isLoading) {
        content = <PulseLoader color={"#FFF"} />
    } else if (isError) {
        content = (
            <p className="errmsg">
                {error?.data?.message} - <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && refreshSuccess) {
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    }

    return content
}

export default PersistLogin
