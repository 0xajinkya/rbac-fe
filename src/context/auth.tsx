"use client";

import { AuthApi } from "@api/auth";
import { IAuthenticationFormState } from "@interfaces/common";
import { createContext, ReactNode, useContext, useState } from "react";
import { GlobalContext } from "./global";
import { useRouter } from "next/navigation";

interface IAuthentication {
    formState: IAuthenticationFormState,
    setFormState: React.Dispatch<React.SetStateAction<IAuthenticationFormState>>;
    handleChange: (key: keyof IAuthenticationFormState, value: string) => void;
    SignUp: () => Promise<void>;
    Login: () => void;
}

const initialState: IAuthentication = {
    formState: {
        email: "",
        password: "",
        confirmPassword: ""
    },
    setFormState: () => { },
    handleChange: () => { },
    SignUp: async () => { },
    Login: () => { }
};

export const AuthenticationContext = createContext<IAuthentication>(initialState);

export const AuthenticationProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const router = useRouter();

    const {
        user
    } = useContext(GlobalContext);

    const [formState, setFormState] = useState<IAuthenticationFormState>({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (key: keyof typeof formState, value: string) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const SignUp = async () => {
        try {
            await AuthApi.Signup(formState);
        } catch (error) {
            throw error;
        } finally {
            setFormState({
                email: "",
                password: "",
                confirmPassword: ""
            })
        }
    };

    const Login = async () => {
        try {
            await AuthApi.Signin(formState);
        } catch (error) {
            throw error;
        } finally {
            setFormState({
                email: "",
                password: "",
                confirmPassword: ""
            })
        }
    }

    if (user?.id) {
        router.replace("/");
        return;
    }

    return (
        <AuthenticationContext.Provider
            value={{
                formState,
                setFormState,
                handleChange,
                SignUp,
                Login
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    )
}