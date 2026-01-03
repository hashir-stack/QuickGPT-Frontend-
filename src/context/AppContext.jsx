import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({children}) =>{

    const navigate = useNavigate();
    const[user,setUser] = useState(null);
    const[selectedChat,setSelectedChat] = useState(null);
    const[chats,setChats] = useState([]);
    const[theme,setTheme] = useState(localStorage.getItem('theme') || 'light');

    const fetchUser = async () =>{
        setUser(dummyUserData);
    };

    const fetchUserChats = async () =>{
        setChats(dummyChats);
        setSelectedChat(dummyChats[0]);
    };

    // for the theme
    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
    },[theme])

    // for the users Chats
    useEffect(()=>{
        if(user){
            fetchUserChats();
        }else{
            setChats([]);
            setSelectedChat(null);
        }
    },[user]);

    // for fetching the user 
    useEffect(()=>{
        fetchUser();
    },[]);

    const value ={navigate,user,setUser,fetchUser,chats,setChats,selectedChat,setSelectedChat,theme}

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => useContext(AppContext);