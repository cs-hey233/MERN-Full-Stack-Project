/*
 * The PersistLogin component manages login persistence by handling authentication token
 * refreshes and rendering user interfaces based on the authentication status. It leverages
 * Redux for state management and RTK Query for server communication.
 */

import { Outlet, Link } from "react-router-dom";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import usePersist from "../../hooks/usePersist";

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const hasEffectRunRef = useRef(false)

    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

    useEffect(() => {
        if (hasEffectRunRef.current === false) {
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                
            }
        }
    })

    
}

export default PersistLogin
