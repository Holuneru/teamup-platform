import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {

        try {

            const res = await api.get("/users/me");

            setUser(res.data);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data)
            );

        } catch (err) {

            console.log(err);

            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        refreshUser();

    }, []);

    return (

        <UserContext.Provider
            value={{
                user,
                setUser,
                refreshUser,
                loading
            }}
        >

            {children}

        </UserContext.Provider>

    );

}

export function useUser() {

    return useContext(UserContext);

}