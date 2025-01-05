import { CSSProperties, FormEventHandler } from "react"
import { FormButton } from "./button"

interface IForm {
    children: React.ReactNode,
    onSubmit: FormEventHandler<HTMLFormElement>,
    button: {
        title: string
        loading?: boolean,
        disabled?: boolean,
        type?: "submit" | "reset" | "button"
    },
    sx?: CSSProperties | undefined;
    variant?: "light" | "dark";
}

export const Form = ({ children, onSubmit, button, sx, variant }: IForm) => {
    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                ...sx
            }}
            onSubmit={onSubmit}
            method="POST"
        >
            {children}
            <FormButton
                text={button.title}
                type={"submit"}
                loading={button.loading ?? false}
                disabled={button.disabled ?? false}
                variant={variant}
            />
        </form>
    )
}