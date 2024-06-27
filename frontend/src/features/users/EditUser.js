import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
    useTitle('techNotes: Edit User')

    // Extract the 'id' parameter from the URL using the useParams hook
    const { id } = useParams()

    // Retrieve the user data from the Redux store using the useSelector hook
    // selectUserById is a selector function that fetches a user by their ID from the state
    const user = useSelector(state => selectUserById(state, id))

    // Conditional rendering: Check if the user data is available
    // If user exists, render the EditUserForm with the user data passed as a prop
    // Otherwise, display a loading message
    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

    return content
}

export default EditUser