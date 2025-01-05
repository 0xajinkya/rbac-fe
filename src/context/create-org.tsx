import { OrgApi } from "@api/org";
import { ICreateOrgFormState } from "@interfaces/common";
import { createContext, useContext, useState } from "react";
import { GlobalContext } from "./global";

interface ICreateOrgContext {
    formState: ICreateOrgFormState,
    handleChange: (key: "name", value: string) => void,
    Create: () => Promise<void>
}

const initialState: ICreateOrgContext = {
    formState: {
        name: ""
    },
    handleChange: () => { },
    Create: async () => { }
}

export const CreateOrgContext = createContext<ICreateOrgContext>(initialState);

export const CreateOrgProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const {
        setOrganization,
        setStaff,
        changeCurrentOrganization,
        setUser
    } = useContext(GlobalContext);
    const [formState, setFormState] = useState<ICreateOrgFormState>({
        name: ""
    });

    const handleChange = (key: keyof typeof formState, value: string) => {
        setFormState(prevState => ({
            ...prevState,
            [key]: value
        }))
    }

    const Create = async () => {
        try {
            const response = await OrgApi.Create(formState);
            console.log(response);
            if (response.content.data) {
                setOrganization(response.content.data.organization);
                const orgId = response.content.data.organization.id;
                changeCurrentOrganization(orgId);
                setStaff(response.content.data.staff);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setUser((usr) => ({ ...usr, active_organization_id: orgId } as any));
            }
        } catch (error) {
            throw error;
        } finally {
            setFormState({
                name: ""
            })
        }
    }

    return (
        <CreateOrgContext.Provider
            value={{
                formState,
                handleChange,
                Create
            }}
        >
            {children}
        </CreateOrgContext.Provider>
    )
}