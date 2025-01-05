import { OpenOrgModal } from "@global/open-org-modal";
import { Sidebar } from "@global/sidebar";
import { Box } from "@mui/material";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                height: "100vh",
                backgroundColor: "#dd0d26"
            }}
        >
            <Sidebar />
            <Box
                sx={{
                    flex: 9,
                    px: "24px",
                    py: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "stretch"
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        height: "100%",
                        borderRadius: "24px",
                        overflow: "auto"
                    }}
                >
                    {children}
                </Box>
            </Box>
            <OpenOrgModal
            />
        </Box>
    );
}