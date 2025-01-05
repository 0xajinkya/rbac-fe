"use client"

import { CreateOrgContext } from "@context/create-org"
import { Form } from "@global/form"
import { CInput } from "@global/input"
import { IError } from "@interfaces/common"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useContext } from "react"

export const CreateOrgPage = () => {
    const router = useRouter();
    const {
        formState,
        handleChange,
        Create
    } = useContext(CreateOrgContext);

    return (
        <Form
            onSubmit={async (e) => {
                try {
                    e.preventDefault();
                    await Create();
                    enqueueSnackbar({ message: "Organization created successfully!", variant: "success" })
                    router.push("/")
                } catch (error) {
                    (error as IError).response.data.errors.map((err: { message: string }) =>
                        enqueueSnackbar({ message: err.message, variant: "error" })
                    )
                }
            }}
            button={{
                title: "Create Organization"
            }}
        >
            <CInput
                variant="dark"
                name="name"
                placeholder="Enter your organization name"
                label="Organization Name"
                onChange={(e) => handleChange("name", e.target.value)}
                value={formState.name}
            />
        </Form>
    )
}