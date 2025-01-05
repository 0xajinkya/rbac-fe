import { AuthenticationProvider } from "@/context/auth"
import { Box } from "@mui/material"
import Image from "next/image"

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
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
                    backgroundColor: "#dd0d26"
                }}
            >
                <AuthenticationProvider>
                    {children}
                </AuthenticationProvider>
            </Box>
            <Box
                sx={{
                    flex: [0, 1],
                    display: ["none", "none", "flex"],
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                }}
            >
                <Image
                    src={"/layout/auth.jpg"}
                    fill
                    alt={"CyberPunk"}
                    style={{
                        objectFit: "cover",
                        objectPosition: "right center"
                    }}
                    priority
                />
            </Box>
        </Box>
    )
}