import { IBlog, IBlogCommentExpanded, IBlogQuery, IQuery, IResponse, IReviewExpanded } from "@interfaces/common";
import http from "@utils/axios";

const Update = async (id: string, data: Pick<IBlog, "title" | "content" | "published">, organization_id?: string | null) => {
    const response = await http.put<IResponse<IBlogQuery>>(`/blog/${id}/update`, data, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const Create = async (data: Pick<IBlog, "title" | "content" | "published">, organization_id?: string | null) => {
    const response = await http.post<IResponse<IBlogQuery>>("/blog", data, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const Query = async ({organization_id, query}: {organization_id?: string | null, query?: IQuery}) => {
    const response = await http.post<IResponse<IBlogQuery[]>>("/blog/query", {
        where: {
            ...query?.where,
            deleted: query?.where?.deleted ?? false,
            ...(organization_id && { organization_id: organization_id })
        },
        include: {
            ...query?.include,
            created_by_staff: query?.include?.created_by_staff ? query.include.created_by_staff : {
                include: {
                    user: true
                }
            }
        }
    });
    return response.data;
}

const Publish = async (id: string, organization_id?: string | null) => {
    const response = await http.put<IResponse<IBlogQuery>>(`/blog/${id}/publish`, {}, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const UnPublish = async (id: string, organization_id?: string | null) => {
    const response = await http.put<IResponse<IBlogQuery>>(`/blog/${id}/un-publish`, {}, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const Delete = async (id: string, organization_id?: string | null) => {
    const response = await http.delete<IResponse<IBlog>>(`/blog/${id}/delete`, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const CreateComment = async (id: string, comment: string) => {
    const response = await http.post<IResponse<IBlogCommentExpanded>>(`/blog/${id}/comment`, {
        comment: comment
    });
    return response.data;
}

const CreateReview = async (id: string, review: string, organization_id?: string | null) => {
    const response = await http.post<IResponse<IReviewExpanded>>(`/blog/${id}/review`, {
        review: review
    }, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}


export const BlogApi = {
    Query,
    Create,
    Update,
    Publish,
    UnPublish,
    Delete,
    CreateComment,
    CreateReview
}