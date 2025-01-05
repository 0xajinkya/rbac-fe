"use client";

import { BlogApi } from "@api/blog";
import { GlobalContext } from "@context/global";
import { Form } from "@global/form";
import { CInput } from "@global/input";
import { IBlogCommentExpanded, IBlogHome, IBlogQuery } from "@interfaces/common";
import { Box, Divider, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react"

const SingleBlog = (blog: IBlogQuery) => {

    const {
        user
    } = useContext(GlobalContext);
    
    const [comments, setComments] = useState<IBlogCommentExpanded[]>(blog.blog_comment);
    const [input, setInput] = useState<{ value: string }>({
        value: ""
    });
    const CreateComment = async (comment: string) => {
        try {
            const res = await BlogApi.CreateComment(blog.id, comment);
            setComments([res.content.data, ...comments]);
            enqueueSnackbar({ message: "Comment added successfully!", variant: "success" })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error.response.data.errors[0].message, variant: "error" })
        }
    }

    return (
        <Box
            sx={{
                // width: "100%",
                border: "1px solid black",
                px: "16px",
                py: "6px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 700 }}>{blog.title}</Typography>
                    <Typography

                    >{blog.content}</Typography>
                </ Box>
                <Typography
                    sx={{
                        fontSize: "10px"
                    }}
                >
                    {blog.created_at.split("T")[0]}
                </Typography>
            </Box>
            <Divider />
            <Box>
                <Typography>
                    Written by: <b>{blog.created_by_staff.user.first_name ?? blog.created_by_staff.user.email.split("@")[0]}</b>
                </Typography>
                <Typography>
                    Written for: <b>{blog.organization.name}</b>
                </Typography>
            </Box>
            <Divider />
            <Box
                sx={{
                    display: user ? "flex" : "none",
                    flexDirection: "column",
                    gap: "8px"
                }}
            >
                <Typography>
                    Add Comment:
                </Typography>
                <Form
                    button={{
                        title: "Add Comment",
                        type: "submit"
                    }}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        CreateComment(input.value);
                        setInput({
                            value: ""
                        })
                    }}
                    variant="dark"
                    sx={{
                        marginTop: "12px"
                    }}
                >
                    <CInput
                        value={input.value}
                        onChange={(e) => setInput({
                            value: e.target.value
                        })}
                        label="Comment"
                        type="text"
                        name="Comment"
                        variant="dark"
                    />
                </Form>
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                }}
            >
                <Typography>
                    Comments:
                </Typography>
                {comments.map((comment, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            gap: "8px",
                            border: "1px solid black",
                            borderRadius: "12px",
                            px: "16px",
                            py: "6px"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700
                                }}
                            >
                                {comment.created_by_user?.first_name ?? comment.created_by_user?.email.split("@")[0]}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "10px"
                                }}
                            >
                                {comment.created_at.split("T")[0]}
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontSize: "16px"
                            }}
                        >
                            {comment.comment}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export const HomePage = () => {

    const [blogs, setBlogs] = useState<IBlogQuery[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await BlogApi.Query({
                    query: {
                        where: {
                            published: true
                        },
                        include: {
                            organization: true,
                            blog_comment: {
                                include: {
                                    created_by_user: true
                                }
                            }
                        }
                    }
                });
                setBlogs(res.content.data as IBlogHome[]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                enqueueSnackbar({ message: "Cannot fetch blogs!", variant: "error" })
            }
        }
        fetchBlogs();
    }, [])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            {blogs?.map((blog, index) => (
                <SingleBlog
                    key={index}
                    {...blog}
                />
            ))}
        </Box>
    )
}