"use client";

import { BlogApi } from "@api/blog";
import { GlobalContext } from "@context/global";
import { Form } from "@global/form";
import { CInput } from "@global/input";
import { IBlogWithReview, IReviewExpanded } from "@interfaces/common";
import { Box, Divider, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react"

const SingleBlog = (blog: IBlogWithReview) => {

    const {
        user
    } = useContext(GlobalContext);

    const [reviews, setReview] = useState<IReviewExpanded[]>(blog.blog_review);
    const [input, setInput] = useState<{ value: string }>({
        value: ""
    });
    const CreateReview = async (review: string) => {
        try {
            const res = await BlogApi.CreateReview(blog.id, review, user?.active_organization_id);
            setReview([{
                ...res.content.data, created_by_staff: {
                    ...res.content.data.created_by_staff,
                    user: user
                }
            } as IReviewExpanded, ...reviews]);
            enqueueSnackbar({ message: "Review added successfully!", variant: "success" })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error.response.data.errors[0].message, variant: "error" })
        }
    }

    console.log(reviews);

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
                    Add Review:
                </Typography>
                <Form
                    button={{
                        title: "Add Review",
                        type: "submit"
                    }}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        CreateReview(input.value);
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
                        label="Review"
                        type="text"
                        name="Review"
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
                    Reviews:
                </Typography>
                {reviews.map((review, index) => (
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
                                {review.created_by_staff?.user?.first_name ?? review.created_by_staff?.user?.email.split("@")[0]}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "10px"
                                }}
                            >
                                {review.created_at.split("T")[0]}
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontSize: "16px"
                            }}
                        >
                            {review.review}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export const BlogPage = () => {

    const [blogs, setBlogs] = useState<IBlogWithReview[]>([]);

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
                            blog_review: {
                                include: {
                                    created_by_staff: {
                                        include: {
                                            user: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                setBlogs(res.content.data as unknown as IBlogWithReview[]);
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