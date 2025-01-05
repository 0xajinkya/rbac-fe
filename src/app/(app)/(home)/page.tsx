import { Box } from "@mui/material";
import { HomePage } from "@page/home";

export default function Home() {
  return (
    <Box
      sx={{
        p: "24px",
        overflow: "auto",
      }}
    >
      <HomePage />
    </Box>
  );
}
