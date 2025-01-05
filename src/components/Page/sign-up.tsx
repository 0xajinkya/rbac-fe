"use client";

import { AuthenticationContext } from "@context/auth"
import { Form } from "@global/form";
import { CInput } from "@global/input";
import { IError } from "@interfaces/common";
import { Box } from "@mui/material"
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useContext } from "react"

export const SignupPage = () => {
    const router = useRouter();
    const {
        formState,
        handleChange,
        SignUp,
    } = useContext(AuthenticationContext);
    return (
        <Box
            sx={{
                width: "50%",
                mx: "auto",
            }}
        >
            <Form
                button={{
                    title: "Sign Up",
                    type: "submit"
                }}
                onSubmit={async (e) => {
                    try {
                        e.preventDefault();
                        await SignUp();
                        enqueueSnackbar({ message: "Signed up successfully!", variant: "success" })
                        router.replace("/")
                    } catch (error: unknown) {
                        (error as IError).response.data.errors.map((err: { message: string }) =>
                            enqueueSnackbar({ message: err.message, variant: "error" })
                        )
                    }
                }}
                variant="light"
            >
                <CInput
                    name="email"
                    placeholder="Enter your email"
                    onChange={(e) => handleChange("email", e.target.value)}
                    value={formState.email}
                    type="email"
                    label="Email"
                    required={true}
                />
                <CInput
                    name="password"
                    placeholder="Let us know your password, hehe"
                    onChange={(e) => handleChange("password", e.target.value)}
                    value={formState.password}
                    type="password"
                    label="Password"
                    required={true}
                />
                <CInput
                    name="confirmPassword"
                    placeholder="Enter your password, once more"
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    value={formState.confirmPassword}
                    label="Confirm Password"
                    required={true}
                />
            </Form>
        </Box>
    )
}