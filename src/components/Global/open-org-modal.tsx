"use client";

import { GlobalContext } from "@context/global"
import { Circle, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Fade, IconButton, Modal, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react"

export const OpenOrgModal = () => {
    const [loading, setLoading] = useState(false);
    const {
        openMemberOrgModal,
        setOpenMemberOrgModal,
        memberOrganizations,
        FetchMemberOrganizations,
        organization,
        LoginToOrganization
    } = useContext(GlobalContext)

    const onClose = () => {
        setOpenMemberOrgModal(false);
    }

    useEffect(() => {
        if (openMemberOrgModal) {
            FetchMemberOrganizations();
        }
    }, [openMemberOrgModal, FetchMemberOrganizations]);

    return (
        <Modal
            open={openMemberOrgModal}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Fade
                in={openMemberOrgModal}
            >
                <Box
                    sx={{
                        width: "20vw",
                        maxHeight: "50vh",
                        height: "auto",
                        backgroundColor: "white",
                        borderRadius: "24px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            mr: "12px",
                            mt: "12px"
                        }}
                    >
                        <IconButton
                            onClick={onClose}
                        >
                            <Close
                                sx={{
                                    color: "black"
                                }}
                            />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            p: "24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px"
                        }}
                    >
                        {memberOrganizations?.length === 0 &&
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "12px"
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "24px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    No Organizations
                                </Typography>
                                <Typography>
                                    You are not a part of any organizations.
                                </Typography>
                            </Box>
                        }
                        {memberOrganizations?.map((or, index) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        border: "1px solid black",
                                        p: "12px",
                                        borderRadius: "12px",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "3px"
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                        >
                                            <Typography>
                                                {or.name}
                                            </Typography>
                                            <Circle
                                                sx={{
                                                    color: "darkgreen",
                                                    fontSize: "12px",
                                                    display: organization?.id === or.id ? "flex" : "none",
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            sx={{
                                                textTransform: "capitalize",
                                                fontSize: "12px"
                                            }}
                                        >
                                            {or?.staff && or?.staff[0]?.role_id?.replace("_", "")}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: organization?.id === or.id ? "none" : "flex",
                                        }}
                                    >
                                        <LoadingButton
                                            sx={{
                                                border: "1px solid black",
                                                backgroundColor: "white",
                                                color: "black",
                                                fontSize: "12px",
                                                textTransform: "capitalize",
                                                borderRadius: "12px"
                                            }}
                                            onClick={async () => {
                                                setLoading(true);
                                                try {
                                                    await LoginToOrganization(or.id)
                                                    enqueueSnackbar({ message: "Logged in to the organization!", variant: "success" })
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                } catch (error) {
                                                    enqueueSnackbar({ message: "Cannot log into this org, at this moment!", variant: "error" })
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            loading={loading}
                                        >
                                            Switch
                                        </LoadingButton>
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}