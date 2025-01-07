"use client";

import { BlogApi } from "@api/blog";
import { GlobalContext } from "@context/global";
import { Form } from "@global/form";
import { CInput } from "@global/input";
import { IBlogWithReview, IReviewExpanded } from "@interfaces/common";
import { Add, Close, Delete, Publish, Unpublished } from "@mui/icons-material";
import { Box, Divider, Fade, IconButton, Modal, Tooltip, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"

const SingleBlog = ({ blog, setBlogs }: { blog: IBlogWithReview, setBlogs: Dispatch<SetStateAction<IBlogWithReview[] | []>> }) => {
    const { user } = useContext(GlobalContext);
    const [reviews, setReview] = useState<IReviewExpanded[]>(blog.blog_review);
    const [input, setInput] = useState<{ value: string }>({ value: "" });
    const [isPublished, setIsPublished] = useState(blog.published); // Add state for published

    const CreateReview = async (review: string) => {
        try {
            const res = await BlogApi.CreateReview(blog.id, review, user?.active_organization_id);
            setReview([{
                ...res.content.data, created_by_staff: {
                    ...res.content.data.created_by_staff,
                    user: user
                }
            } as IReviewExpanded, ...reviews]);
            enqueueSnackbar({ message: "Review added successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error.response.data.errors[0].message, variant: "error" });
        }
    };

    const PublishBlog = async () => {
        try {
            const res = await BlogApi.Publish(blog.id, user?.active_organization_id);
            setBlogs((blogs) => blogs.map((blog) => (blog.id === res.content.data.id ? res.content.data : blog)));
            setIsPublished(true);  // Update the local state for published
            enqueueSnackbar({ message: "Blog published successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error.response.data.errors[0].message, variant: "error" });
        }
    };

    const UnPublishBlog = async () => {
        try {
            const res = await BlogApi.UnPublish(blog.id, user?.active_organization_id);
            setBlogs((blogs) => blogs.map((blog) => (blog.id === res.content.data.id ? res.content.data : blog)));
            setIsPublished(false);  // Update the local state for unpublished
            enqueueSnackbar({ message: "Blog unpublished successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error.response.data.errors[0].message, variant: "error" });
        }
    };

    const HandleDelete = async () => {
        try {
            const res = await BlogApi.Delete(blog.id, user?.active_organization_id);
            setBlogs((blogs) => blogs.filter((blog) => blog.id !== res.content.data.id));
            enqueueSnackbar({ message: "Blog deleted successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error.response.data.errors[0].message, variant: "error" });
        }
    };


    useEffect(() => {
        setReview(blog.blog_review)
    }, [blog])

    return (
        <Box
            sx={{
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
                    <Typography>{blog.content}</Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <Tooltip title="Delete">
                        <IconButton onClick={HandleDelete}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                    {isPublished ?
                        <Tooltip title="Unpublish">
                            <IconButton onClick={UnPublishBlog}>
                                <Unpublished />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Publish">
                            <IconButton onClick={PublishBlog}>
                                <Publish />
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography sx={{ fontSize: "10px" }}>
                        {blog.created_at.split("T")[0]}
                    </Typography>
                </Box>
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
                {reviews?.map((review, index) => (
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
    );
};


export const BlogPage = () => {

    const [blogs, setBlogs] = useState<IBlogWithReview[]>([]);
    const [newBlogModal, setNewBlogModal] = useState<boolean>(false);
    const {
        user
    } = useContext(GlobalContext);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                if (!user?.active_organization_id) {
                    setBlogs([]);
                    return
                };
                const res = await BlogApi.Query({
                    organization_id: user?.active_organization_id,
                    query: {
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
    }, [user?.active_organization_id])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Typography
                    sx={{
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                >
                    Organization&apos;s Blogs
                </Typography>
                <IconButton
                    onClick={() => setNewBlogModal(true)}
                >
                    <Add
                        sx={{
                            color: "black",
                            fontSize: "16px"
                        }}
                    />
                </IconButton>
            </Box>
            {blogs?.map((blog, index) => (
                <SingleBlog
                    key={index}
                    blog={blog}
                    setBlogs={setBlogs}
                />
            ))}
            <AddBlogModal
                open={newBlogModal}
                onClose={() => setNewBlogModal(false)}
                organization_id={user?.active_organization_id}
                setBlogs={setBlogs}
                blogs={blogs}
            />
        </Box>
    )
}

const AddBlogModal = ({
    open,
    onClose,
    organization_id,
    setBlogs,
}: {
    open: boolean,
    onClose: () => void,
    organization_id?: string | null,
    setBlogs: Dispatch<SetStateAction<IBlogWithReview[] | []>>,
    blogs: IBlogWithReview[]
}) => {
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState({
        title: "",
        content: "",
        published: false
    })


    const CreateBlog = async () => {
        setLoading(true);
        try {
            const createdBlog = await BlogApi.Create(blog, organization_id);
            setBlogs((blogs) => ([createdBlog.content.data, ...blogs]));
            enqueueSnackbar({ message: "Blog added successfully!", variant: "success" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar({ message: error?.response.data?.errors[0].message ?? "Failed to add blog!", variant: "error" });
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
                <Box
                    sx={{
                        width: "30vw",
                        height: "30vh",
                        backgroundColor: "white",
                        borderRadius: "24px",
                    }}
                >
                    <Box
                        sx={{
                            p: "24px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                }}
                            >
                                Create a Blog
                            </Typography>
                            <IconButton
                                onClick={() => onClose()}
                            >
                                <Close
                                    sx={{
                                        color: "black",
                                        fontSize: "16px"
                                    }}
                                />
                            </IconButton>
                        </Box>
                        <Form
                            button={{
                                title: "Add Blog",
                                type: "submit",
                                loading: loading
                            }}
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await CreateBlog()
                            }}

                            sx={{}}
                        >
                            <CInput
                                variant="dark"
                                name="Title"
                                label="Title"
                                onChange={(e) => setBlog((blg) => ({ ...blg, title: e.target.value }))}
                            />
                            <CInput
                                variant="dark"
                                name="Content"
                                label="Content"
                                onChange={(e) => setBlog((blg) => ({ ...blg, content: e.target.value }))}
                            />
                            {/* <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            <Typography>
                                Do you want to publish this as well?
                            </Typography>
                        <Switch 
                            onChange={(e) => setBlog((blg) => ({...blg, published: e.target.checked}))}
                        />
                        </Box> */}
                        </Form>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}