import { Box } from "@mui/material"

export const HomeLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Box
            sx={{
            }}
        >
            {children}
        </Box>
    )
}