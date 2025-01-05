import { GlobalContext } from "@context/global";
import { Box } from "@mui/material"
import { useRouter } from "next/navigation"
import { useContext } from "react";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {

    const {
        user
    } = useContext(GlobalContext);
    const router = useRouter();

    if (user?.active_organization_id === null) {
        router.replace("/create");
    }

    return (
        <Box>
            {children}
        </Box>
    )
}