import React, { useContext } from "react";
import { MyContext } from '../context/index.jsx';
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const { isConnected, logout, session }: any = useContext(MyContext);
    const navigate = useNavigate()

    return (
        <div className={`bg-gray-800 p-4 flex ${ session?.token ? 'justify-between' :'justify-end'}  items-center`}>
            {session?.token ?
                <>
                    <div className="text-white">
                        <span>Status: </span>
                        <span className={`${isConnected ? 'text-green-500' : 'text-red-500'}`}>{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </> :
                 <div className="flex space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/SignUp")}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        SignUp
                    </button>
                </div>

            }
        </div>
    );
};

export default Header;
