"use client";

import { GlobalContext } from "@context/global";
import { Box, Button, Typography } from "@mui/material"
import { usePathname, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { MouseEventHandler, useContext } from "react"

const NormalButton = ({
    text,
    onClick
}: {
    text: string,
    onClick: MouseEventHandler<HTMLButtonElement> | undefined
}) => {

    const pathname = usePathname();

    return (
        <Button
            onClick={onClick}
            sx={{
                backgroundColor: pathname.includes(text.toLowerCase()) ? "white" : pathname === "/" && text === "Home" ? "white" : "transparent",
                borderRadius: "24px",
                color: pathname.includes(text.toLowerCase()) ? "#dd0d26" : pathname === "/" && text === "Home" ? "#dd0d26" : "white",
                width: "100%",
                textTransform: "capitalize",
                ":hover": {
                    backgroundColor: "white",
                    color: "#dd0d26"
                }
            }}
        >
            {text}
        </Button>
    )
}

export const Sidebar = () => {

    const router = useRouter();
    const {
        setOpenMemberOrgModal,
        LogOut,
        user
    } = useContext(GlobalContext);

    return (
        <Box
            sx={{
                border: "1px solid red",
                height: "100%",
                flex: 1.2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    // alignItems: "flex-start",
                    gap: "32px",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        px: "12px",
                        py: "12px"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "24px",
                            fontFamily: "Poppins",
                            color: "white",
                            fontWeight: 700
                        }}
                    >
                        BlogR
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: "12px",
                        gap: "16px",
                    }}
                >
                    <NormalButton
                        text="Home"
                        onClick={() => router.push("/")}
                    />
                    <NormalButton
                        text="Users"
                        onClick={() => router.push("/users")}
                    />
                    <NormalButton
                        text="Blogs"
                        onClick={() => router.push("/blogs")}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    p: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                }}
            >
                {user &&

                    <NormalButton
                        text="Switch Organization"
                        onClick={() => setOpenMemberOrgModal(true)}
                    />
                }
                {
                    user ?
                        <NormalButton
                            text="Log out"
                            onClick={async () => {
                                try {
                                    await LogOut();
                                    enqueueSnackbar({ message: "Logged out!", variant: "success" })
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                } catch (error) {
                                    enqueueSnackbar({ message: "Failed to log out!", variant: "error" })
                                }
                            }}
                        />
                        :
                        <NormalButton
                            text="Sign In"
                            onClick={async () => router.push("/sign-in")}
                        />
                }
            </Box>
        </Box>
    )
}