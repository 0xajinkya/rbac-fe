"use client";

import { CreateOrgProvider } from "@context/create-org"
import { Box } from "@mui/material"

export const CreateOrgLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                height: "100vh"
            }}
        >
            <Box
                sx={{
                    flex: [1],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CreateOrgProvider>
                    {children}
                </CreateOrgProvider>
            </Box>
        </Box>
    )
}