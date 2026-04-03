"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "../../axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const signup = async (userData) => {
        try {
            const { data } = await Axios.post("/auth/signup", userData);
            if (data.success) {
                toast.success("Signup successfully", { position: "bottom-right" });
                setUser(data.user);
                setTimeout(() => router.push("/"), 1000);
                return { success: true };
            }
            toast.error(data.message || "Signup failed", { position: "bottom-right" });
            return { success: false, message: data.message };
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            toast.error(errMsg, { position: "bottom-right" });
            return {
                success: false,
                message: errMsg
            };
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await Axios.post('/auth/login', { email, password });

            if (data && data.success) {
                setUser(data.user);
                toast.success("Login successfully", { position: "bottom-right" });
                if (data.user.role === "RECRUITER") {
                    router.push("/posted-jobs");
                } else {
                    router.push("/");
                }
                return { success: true };
            }

            toast.error(data.message || "Login failed", { position: "bottom-right" });
            return { success: false, message: data.message };
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            toast.error(errMsg, { position: "bottom-right" });
            return {
                success: false,
                message: errMsg
            };
        }
    };

    const logout = async () => {
        try {
            await Axios.post('/auth/logout');
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await Axios.get('/auth/check');
                if (data.success) setUser(data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);