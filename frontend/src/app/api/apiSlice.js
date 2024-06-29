import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-api-b3gl.onrender.com',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 401 && result?.error?.data?.message !== "Incorrect password") {
        console.log("sending refresh token")

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            // store the new token
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)

            // Check if the retry still results in a 401 error
            if (result?.error?.status === 401) {
                console.log("Authentication still failing after token refresh.")
                result.error.data.message = "Authentication failed, please log in again."
            }
        } else {
            if (refreshResult?.error?.status === 401) {
                refreshResult.error.data.message = "Login expired.jhnjkhkjhkjhjkh"
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
});