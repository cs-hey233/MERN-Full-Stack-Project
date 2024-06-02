import { apiSlice } from "../../app/api/apiSlice"
import { setCredentials, logOut } from "./authSlice"
import { useDispatch } from "react-redux"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled
                    dispatch(setCredentials({ token: data.accessToken }))
                } catch (error) {
                    console.error('Login failed:', error)
                }
            }
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                } catch (error) {
                    console.error('Logout failed:', error)
                }
            }
        }),
        // TODO: Define a refresh mutation
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
            })
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
 } = authApiSlice