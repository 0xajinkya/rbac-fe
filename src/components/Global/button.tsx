import { LoadingButton } from "@mui/lab"
import { MouseEventHandler } from "react"

interface IFormButton {
    text: string,
    type: "submit" | "reset" | "button",
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined,
    disabled?: boolean,
    loading?: boolean,
    variant?: "light" | "dark"
}

export const FormButton = ({
    text,
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    variant = "dark"
}: IFormButton) => {
    return (
        <LoadingButton
            type={type}
            onClick={type !== "submit" ? onClick : undefined}
            sx={{
                backgroundColor: variant === "light" ? "white" : "#dd0d26",
                borderRadius: "14px",
                py: "10px",
                color: variant === "light" ? "#dd0d26" : "white",
                textTransform: "capitalize",
                fontWeight: "bold",
            }}
            disabled={disabled}
            loading={loading}
        >
            {text}
        </LoadingButton>
    )
}