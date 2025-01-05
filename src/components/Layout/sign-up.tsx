import { Box } from "@mui/material"

export const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            {children}
        </Box>
    )
}       