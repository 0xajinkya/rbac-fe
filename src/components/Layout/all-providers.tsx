"use client";

import { GlobalProvider } from "@context/global";
import { SnackbarProvider } from "notistack";

export const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <SnackbarProvider>
                <GlobalProvider>
                    {children}
                </GlobalProvider>
            </SnackbarProvider>
        </>
    )
}