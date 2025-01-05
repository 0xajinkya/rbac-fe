import { Box, InputBase, Typography } from "@mui/material"
import { ChangeEventHandler } from "react";

interface ICInput {
    placeholder?: string;
    type?: "text" | "password" | "email";
    name: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined;
    value?: string | number | undefined;
    label: string;
    required?: boolean;
    variant?: "light" | "dark";
}

export const CInput = ({
    placeholder,
    type = "text",
    name,
    onChange,
    value,
    label,
    required = false,
    variant = "light"
}: ICInput) => {
    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <InputBase
                sx={{
                    border: `1px solid ${variant !== "light" ? "black" : "white"}`,
                    borderRadius: "14px",
                    px: "12px",
                    py: "8px",
                    width: "100%",
                    color: variant !== "light" ? "black" : "white",
                    "::placeholder": {
                        color: "grey"
                    }
                }}
                placeholder={placeholder}
                type={type}
                name={name}
                onChange={onChange}
                value={value}
                required={required}
            />
            <Typography
                sx={{
                    position: "absolute",
                    top: "-18%",
                    left: "5%",
                    fontSize: "12px",
                    backgroundColor: variant !== "light" ? "white" : "#dd0d26",
                    px: "3px",
                    color: variant !== "light" ? "black" : "white"
                }}
            >
                {label}
            </Typography>
        </Box>
    )
}