import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate , createNewChat , axios , setChats , fetchUserChats , setToken ,token } = useAppContext();

  const [search, setSearch] = useState("");

  const logout = () =>{
    localStorage.removeItem('token');
    setToken(null);
    toast.success(" Logged Out Successfully ... ")
  }

  const deleteChat = async (e ,chatId) =>{
    try {
      e.stopPropagation();
      const confirm = window.confirm('Are You Sure You Want To Delete This Chat ?');
      if(!confirm) return;

      const {data} = await axios.post('/api/chat/delete',{chatId},{headers: { Authorization: token} });
      if(data.success){
        setChats((prev)=>prev.filter(chat => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div
      className={`
        flex flex-col h-screen 
        min-w-60 sm:min-w-72 md:min-w-80 
        p-3 sm:p-5 
        dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 
        border-r border-[#80609F]/30 
        backdrop-blur-3xl 
        transition-all duration-500 
        max-md:absolute left-0 z-10 
        ${!isMenuOpen && "max-md:-translate-x-full"}
      `}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="logo"
        className="w-full max-w-36 sm:max-w-48 md:max-w-56"
      />

      {/* New Chat button */}
      <button
        onClick={createNewChat}
        className="
          flex justify-center items-center w-full 
          py-2 mt-6 sm:mt-10 
          text-white 
          bg-linear-to-r from-[#A456F7] to-[#3D81F6] 
          text-xs sm:text-sm md:text-base 
          rounded-md cursor-pointer
        "
      >
        <span className="mr-2 text-xl sm:text-2xl">+</span> New Chat
      </button>

      {/* Search Conversations */}
      <div
        className="
          flex items-center gap-2 
          p-2 sm:p-3 mt-4 
          border border-gray-400 dark:border-white/20 
          rounded-md
        "
      >
        <img src={assets.search_icon} alt="search icon" className="w-4 not-dark:invert" />
        <input
          type="text"
          placeholder="Search Conversations"
          className="text-xs sm:text-sm placeholder:text-gray-400 outline-none flex-1"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-xs sm:text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-xs sm:text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="
                p-2 px-3 sm:px-4 
                dark:bg-[#57317C]/10 
                border border-gray-300 dark:border-[#80609F]/15 
                rounded-md cursor-pointer 
                flex justify-between group
              "
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                onClick={e=>toast.promise(deleteChat(e,chat._id),{loading:'Deleting...'})}
                src={assets.bin_icon}
                alt="Delete"
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
              />
            </div>
          ))}
      </div>

      {/* Community Images */}
      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="
          flex items-center gap-2 
          p-2 sm:p-3 mt-4 
          border border-gray-300 dark:border-white/15 
          rounded-md cursor-pointer 
          hover:scale-105 transition-all
        "
      >
        <img src={assets.gallery_icon} alt="Gallery Icon" className="w-4.5 not-dark:invert" />
        <div className="flex flex-col text-xs sm:text-sm">
          <p>Community Images</p>
        </div>
      </div>

      {/* Credits Purchase option */}
      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="
          flex items-center gap-2 
          p-2 sm:p-3 mt-4 
          border border-gray-300 dark:border-white/15 
          rounded-md cursor-pointer 
          hover:scale-105 transition-all
        "
      >
        <img src={assets.diamond_icon} alt="Credits Icon" className="w-4.5 dark:invert" />
        <div className="flex flex-col text-xs sm:text-sm">
          <p>Credits : {user?.credits}</p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            Purchase credits to use QuickGPT
          </p>
        </div>
      </div>

      {/* Toggle the themes */}
      <div
        className="
          flex items-center justify-between gap-2 
          p-2 sm:p-3 mt-4 
          border border-gray-300 dark:border-white/15 
          rounded-md
        "
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <img src={assets.theme_icon} alt="Theme" className="w-4 not-dark:invert" />
          <p>Dark Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="sr-only peer"
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User Account */}
      <div
        className="
          flex items-center gap-3 
          p-2 sm:p-3 mt-4 
          border border-gray-300 dark:border-white/15 
          rounded-md cursor-pointer group
        "
      >
        <img src={assets.user_icon} alt="User Icon" className="w-6 sm:w-7 rounded-full" />
        <p className="flex-1 text-xs sm:text-sm dark:text-primary truncate">
          {user ? user.name : "Login Your Account"}
        </p>
        {user && (
          <img
            onClick={logout}
            src={assets.logout_icon}
            className="h-4 sm:h-5 cursor-pointer hidden not-dark:invert group-hover:block"
          />
        )}
      </div>

      {/* Close icon for mobile */}
      <img
        src={assets.close_icon}
        alt="close icon"
        className="absolute top-3 right-3 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer md:hidden not-dark:invert"
        onClick={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
