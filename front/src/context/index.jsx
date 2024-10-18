import React, { createContext, useState, useEffect } from 'react';
import io from "socket.io-client";
import { WSS_URL } from "../env"
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';


export const MyContext = createContext(null);

export const MyContextProvider = ({ children }) => {
    const [subscribedProducts, setSubscribedProducts] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [prices, setPrices] = useState({});
    const [session, setSession] = useState(JSON.parse(localStorage.getItem('jwtToken')) || false);
    const [socket, setSocket] = useState(null)

    const logout = () => {
        localStorage.removeItem('jwtToken')
        setSession(null)
    }

    const login = (token) => {
        localStorage.setItem('jwtToken', JSON.stringify(token))
        setSession(token)
    }

    useEffect(() => {
        // Socket connect using token
        if (session?.token) {
            const newSocket = io(`${WSS_URL}`, {
                autoConnect: true,
                extraHeaders: {
                    authorization: session?.token
                },
            });
            newSocket.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
                setSocket(newSocket);
            });

            // data from socket
            newSocket.on('ticker', (data) => {
                if (data.data?.e === "trade") {
                    setPrices((prevPrices) => ({
                        ...prevPrices,
                        [data.stream]: {
                            product_id: data.stream,
                            trade_id: data.data.t,
                            price: data.data.p,
                            quantity: data.data.q,
                            side: !data.data.m ? 'buy' : 'sell',  // Set isBuy based on the `m` field
                            time: data.data.T,
                        },
                    }));
                }

            });

            newSocket.on('connection-response', (data) => {
                Swal.fire({
                    title: data?.type,
                    text: data?.message,
                    icon: data?.type,
                    showConfirmButton: false,
                    timer: 1500
                });
                if(data?.is_token_expire === true){
                    logout()
                }
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
                setSocket(null);
            });

            newSocket.on('connect_error', (error) => {
                console.log('Socket connection error:', error);
                setIsConnected(false);
                setSocket(null);
            });
        }

        return () => {
            if (isConnected) {
                socket.off('connect');
                socket.off('ticker');
                socket.off('success-response');
                socket.off('error-response');
                socket.off('disconnect');
                socket.off('connect_error');
            }

        };
    }, [session]);

    // subscribe to products
    const subscribe = (product) => {
        setSubscribedProducts([...subscribedProducts, product]);
        const msg = {
            type: 'SUBSCRIBE',
            channels: [product],
        }
        socket.emit('subscribe', msg);
    };

    // unsubscribe from products
    const unsubscribe = (product) => {
        setSubscribedProducts(subscribedProducts.filter((p) => p !== product));
        const updatedPrices = { ...prices };
        delete updatedPrices[product]
        setPrices(updatedPrices);

        const msg = {
            type: 'UNSUBSCRIBE',
            channels: [product],
        }
        socket.emit('unsubscribe', msg);
    };

    const value = React.useMemo(() => ({ subscribedProducts, setSubscribedProducts, subscribe, unsubscribe, isConnected, setIsConnected, prices, logout, session, login }), [prices, isConnected, subscribedProducts, session]); // value is cached by useMemo

    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
};
MyContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // This will validate that children are passed
};
