import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [userData, setuserData] = useState(false)
    
    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setisLoggedIn(true)
                getUserData();
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
   
     const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setuserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
     }

     useEffect(() => {
        getAuthState()
     }, [])
     

    const value = {
        backendUrl,
        isLoggedIn,setisLoggedIn,
        userData,setuserData,
        getUserData
    }

 return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
 )
}