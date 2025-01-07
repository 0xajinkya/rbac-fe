import { AuthApi } from "@api/auth";
import { OrgApi } from "@api/org";
import { StaffApi } from "@api/staff";
import { ICommonUser, IMemberOrganization, IOrganization, IStaff } from "@interfaces/common";
import { usePathname, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

interface IGlobalContext {
    user: ICommonUser | null,
    staff: IStaff | null,
    organization: IOrganization | null,
    setUser: Dispatch<SetStateAction<ICommonUser | null>>,
    setOrganization: Dispatch<SetStateAction<IOrganization | null>>,
    setStaff: Dispatch<SetStateAction<IStaff | null>>,
    changeCurrentOrganization: (id: string) => Promise<void>;
    LoginToOrganization: (organization_id: string) => Promise<void>;
    openMemberOrgModal: boolean;
    setOpenMemberOrgModal: Dispatch<SetStateAction<boolean>>;
    LogOut: () => Promise<void>;
    memberOrganizations: IMemberOrganization[] | null;
    FetchMemberOrganizations: () => Promise<void>
}

const initialState: IGlobalContext = {
    user: null,
    staff: null,
    organization: null,
    setUser: () => { },
    setOrganization: () => { },
    setStaff: () => { },
    changeCurrentOrganization: async () => { },
    LoginToOrganization: async () => { },
    openMemberOrgModal: false,
    setOpenMemberOrgModal: () => { },
    LogOut: async () => { },
    memberOrganizations: null,
    FetchMemberOrganizations: async () => { }
};

export const GlobalContext = createContext<IGlobalContext>(initialState);

export const GlobalProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<ICommonUser | null>(null);
    const [staff, setStaff] = useState<IStaff | null>(null);
    const [organization, setOrganization] = useState<IOrganization | null>(null);
    const [memberOrganizations, setMemberOrganizations] = useState<IMemberOrganization[]>([]);
    const [openMemberOrgModal, setOpenMemberOrgModal] = useState(false);

    const changeCurrentOrganization = async (id: string) => {
        setUser(prevState => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...prevState as any,
            active_organization_id: id
        }));
    }

    const LogOut = async () => {
        setUser(null);
        setOrganization(null);
        setStaff(null);
        await AuthApi.Signout();
        router.replace("/sign-in");
    }

    const FetchMemberOrganizations = async () => {
        const response = await OrgApi.ListMemberOrganizations();
        setMemberOrganizations(response.content.data);
    }

    const LoginToOrganization = async (organization_id: string) => {
        const response = await OrgApi.LoginToOrganization(organization_id);
        if (response.status) {
            setUser(response.content.data.staff?.user ?? null);
            setOrganization(response.content.data);
            setStaff(response.content.data.staff);
            enqueueSnackbar({ message: "Logged in to the organization!", variant: "success" });
            window.location.replace("/");
        } else {
            enqueueSnackbar({ message: "Failed to login to organization!", variant: "error" });
        }
    }

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const user = await AuthApi.GetMe();
                if (!user) {
                    router.replace("/sign-in");
                    return;
                }
                setUser(user.content.data);
                if (user.content.data.active_organization_id === null) {
                    await FetchMemberOrganizations();
                    if (memberOrganizations.length === 0) {
                        // router.replace("/create");
                        return;
                    }
                    setOpenMemberOrgModal(true);
                    return;
                }
                const organization = await OrgApi.Get(user.content.data.active_organization_id);
                if (!organization.content.data.id) {
                    router.replace("/create");
                    return;
                }
                setOrganization(organization.content.data);
                const staff = await StaffApi.GetMe(user.content.data.active_organization_id);
                if (!staff.content.data.id) {
                    router.replace("/create");
                    return;
                }
                setStaff(staff.content.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                if (pathname !== "/" && pathname !== "/sign-in" && pathname !== "/sign-up") {
                    enqueueSnackbar({ message: "You are not logged in, you cannot access this page!", variant: "warning" })
                    router.replace("/");
                }
            }
        }
        fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <GlobalContext.Provider
            value={{
                user,
                setOrganization,
                setStaff,
                setUser,
                staff,
                organization,
                changeCurrentOrganization,
                LoginToOrganization,
                openMemberOrgModal,
                setOpenMemberOrgModal,
                LogOut,
                memberOrganizations,
                FetchMemberOrganizations
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}