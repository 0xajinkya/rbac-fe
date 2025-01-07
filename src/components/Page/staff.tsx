"use client";

import { StaffApi } from "@api/staff";
import { UserApi } from "@api/user";
import { GlobalContext } from "@context/global";
import { Form } from "@global/form";
import { IStaff, IStaffQuery, IUser } from "@interfaces/common";
import { Add, Delete } from "@mui/icons-material"
import { Box, Checkbox, Fade, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Tooltip, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

const StaffCard = ({
    user,
    role_id,
    handleDelete
}: IStaff & {
    user: IUser | null,
    handleDelete: () => void;
}) => {
    return (
        <Box
            sx={{
                border: "1px solid black",
                p: "12px",
                borderRadius: "12px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 700 }}>{user?.first_name ? user?.first_name + " " + user?.last_name : user?.email.split("@")[0]}</Typography>
                    <Typography>{user?.email}</Typography>
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: role_id === "super_admin" ? "darkgreen" : role_id === "admin" ? "darkorange" : role_id === "editor" ? "brown" : "red",
                            textTransform: "capitalize"
                        }}
                    >
                        {role_id.replace("_", " ")}
                    </Typography>
                </Box>
                <Box>
                    <IconButton
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        <Delete
                            sx={{
                                color: "darkred",
                                fontSize: "14px"
                            }}
                        />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export const StaffPage = () => {

    const {
        user
    } = useContext(GlobalContext);
    const [staff, setStaff] = useState<IStaffQuery[] | []>([]);
    const [addOpenStaffModal, setAddOpenStaffModal] = useState(false);

    useEffect(() => {
        const fetchUsersToAdd = async () => {
            if (!user?.active_organization_id) return;
            // const response = await UserApi.ListUserToAdd(user?.active_organization_id);
            console.log(user?.active_organization_id);
            const response = await StaffApi.List(user?.active_organization_id);
            setStaff(response.content.data);
            console.log(response);
        }
        fetchUsersToAdd();
    }, [user?.active_organization_id]);

    const handleDelete = async (id: string) => {
        try {
            await StaffApi.Delete(id, user?.active_organization_id);
            setStaff((staff) => staff.filter((staff) => staff.id !== id));
            enqueueSnackbar({ message: "Staff deleted successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            enqueueSnackbar({ message: "Failed to delete staff!", variant: "error" });
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "24px",
                        fontWeight: "bold"
                    }}
                >
                    Staff
                </Typography>
                <Tooltip title="Add a staff">
                    <IconButton
                        onClick={() => setAddOpenStaffModal(true)}
                    >
                        <Add
                            sx={{
                                color: "black"
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    columnGap: "16px",
                    rowGap: "16px",
                }}
            >
                {staff.map((staff, index) => (
                    <StaffCard
                        key={index}
                        {...staff}
                        user={staff.user}
                        handleDelete={() => handleDelete(staff.id)}
                    />
                ))}
            </Box>
            <AddStaffModal
                open={addOpenStaffModal}
                onClose={() => setAddOpenStaffModal(false)}
                organization_id={user?.active_organization_id}
                setStaff={setStaff}
                staff={staff}
            />
        </Box>
    )
}

const AddStaffModal = ({
    open,
    onClose,
    organization_id,
    setStaff,
    staff
}: {
    open: boolean,
    onClose: () => void,
    organization_id?: string | null,
    setStaff: Dispatch<SetStateAction<IStaffQuery[] | []>>,
    staff: IStaffQuery[]
}) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [addToStaffQueue, setAddToStaffQueue] = useState<string[]>([]);
    const [role, setRole] = useState<"super_admin" | "admin" | "editor" | "reviewer">("reviewer");
    useEffect(() => {
        const ListOfUsersToAdd = async () => {
            const response = await UserApi.ListUserToAdd(organization_id);
            setUsers(response.content.data);
        }
        if (open === true) {
            ListOfUsersToAdd();
        }
    }, [open, organization_id]);

    const AddStaff = async () => {
        setLoading(true);
        try {
            for (const staff of addToStaffQueue) {
                const res = await StaffApi.Add(staff, role, organization_id);
                setStaff((st) => ([res.content.data, ...st]));
            }
            enqueueSnackbar({ message: "Staff added successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error?.response.data?.errors[0].message ?? "Failed to add staff!", variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Fade
                in={open}
            >
                <Box>
                    <Form
                        button={{
                            title: "Add Staff",
                            type: "submit",
                            loading: loading
                        }}
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await AddStaff()
                        }}

                        sx={{}}
                    >
                        <Box
                            sx={{
                                width: "25vw",
                                height: "50vh",
                                backgroundColor: "white",
                                borderRadius: "24px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "24px",
                            }}
                        >
                            <Box
                                sx={{
                                    p: "24px",
                                    height: "100%",
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: '12px'
                                }}
                            >
                                {
                                    users.map((user, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                border: "1px solid black",
                                                p: "12px",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <Box>
                                                <Typography sx={{ fontWeight: 700 }}>{user.first_name ? user.first_name + " " + user.last_name : user.email.split("@")[0]}</Typography>
                                                <Typography>{user.email}</Typography>
                                            </Box>
                                            <Box>
                                                <Checkbox
                                                    sx={{
                                                        color: "black"
                                                    }}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setAddToStaffQueue((arr) => [...arr, user.id]);
                                                        } else {
                                                            setAddToStaffQueue((arr) => arr.filter((id) => id !== user.id));
                                                        }
                                                    }}
                                                    disabled={!!staff.find((staff) => staff.user_id === user.id)}
                                                />
                                            </Box>
                                        </Box>
                                    ))
                                }
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "center",
                                    p: "24px"
                                }}
                            >
                                <Typography>
                                    Add as...
                                </Typography>
                                <FormControl>
                                    <InputLabel
                                        id="role-select"
                                    >
                                        Choose Role
                                    </InputLabel>
                                    <Select
                                        sx={{
                                            width: "150px"
                                        }}
                                        label="Choose role"
                                        labelId="role-select"
                                        onChange={(e) => setRole(e.target.value as "super_admin" | "admin" | "editor" | "reviewer")}
                                        value={role}
                                    >
                                        <MenuItem value="super_admin">Super Admin</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                        <MenuItem value="editor">Editor</MenuItem>
                                        <MenuItem value="reviewer">Reviewer</MenuItem>
                                    </Select>

                                </FormControl>
                            </Box>
                        </Box>
                    </Form>
                </Box>
            </Fade>
        </Modal>
    )
}