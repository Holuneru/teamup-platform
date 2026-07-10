import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [invitations, setInvitations] = useState([]);

    // Пользователи, которым уже отправили приглашение
    const [sentInvitations, setSentInvitations] = useState([]);

    const refreshUser = async () => {

        try {

            const userResponse = await api.get("/users/me");

            setUser(userResponse.data);

            localStorage.setItem(
                "user",
                JSON.stringify(userResponse.data)
            );

            const invitationResponse = await api.get("/invitations/me");

            setInvitations(invitationResponse.data);

        } catch (err) {

            console.log(err);

            setUser(null);

            setInvitations([]);

        } finally {

            setLoading(false);

        }

    };

    const refreshInvitations = async () => {

        try {

            const res = await api.get("/invitations/me");

            setInvitations(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    // Добавить пользователя в список уже приглашённых
    const addSentInvitation = (userId) => {

        setSentInvitations(prev => {

            if (prev.includes(userId)) {
                return prev;
            }

            return [...prev, userId];

        });

    };

    useEffect(() => {

        refreshUser();

    }, []);

    return (

        <UserContext.Provider
            value={{
                user,
                setUser,

                loading,

                refreshUser,

                invitations,
                refreshInvitations,

                sentInvitations,
                addSentInvitation
            }}
        >

            {children}

        </UserContext.Provider>

    );

}

export function useUser() {

    return useContext(UserContext);

}