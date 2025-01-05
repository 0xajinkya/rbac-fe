export interface IAuthenticationFormState {
    email: string
    password: string
    confirmPassword?: string
}

export interface IUser {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    created_at: Date;
    updated_at: Date;
    active_organization_id: string | null;
    deleted: boolean | null;
}
export interface ISignupResponse {
    status: boolean,
    content: {
        data: IUser,
        meta: {
            access_token: string,
            refresh_token: string
        }
    }
}

export type IResponse<T> = {
    status: boolean,
    content: {
        data: T,
        meta: {
            total: number,
            pages: number
        }
    }
}

export interface IGetMeResponse {
    active_organization_id: string | null;
    created_at: Date;
    deleted: boolean | null;
    email: string;
    first_name: string | null;
    id: string;
    last_name: string | null;
    updated_at: Date;
}

export interface IError {
    response: {
        data: {
            errors: {
                message: string
            }[]
        }
    }
}

export interface ICommonUser {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    active_organization_id: string | null;
}

export interface IStaff {
    organization_id: string;
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    role_id: string;
    deleted: boolean | null;
}


export type IStaffQuery = IStaff & {
    user: IUser | null;
    role: IRole | null;
    organization: IOrganization | null;
}

export interface IRole {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface IOrganization {
    id: string;
    created_at: Date;
    updated_at: Date;
    deleted: boolean | null;
    name: string;
    created_by_id: string;
}

export type IMemberOrganization = IOrganization & {
    staff: IStaff[] | null
}

export type IOrganizationLogin = IOrganization & {
    staff: IStaff & {
        role: IRole | null;
        user: ICommonUser | null;
    } | null;
}

export interface ICreateOrgFormState {
    name: string
}

export interface IBlog {
    id: string;
    created_at: string;
    updated_at: string;
    deleted: boolean | null;
    organization_id: string;
    title: string;
    content: string;
    published: boolean;
    created_by_staff_id: string;
}

export type IBlogQuery = IBlog & {
    created_by_staff: IStaff & {
        user: IUser
    },
    organization: IOrganization;
    blog_comment: IBlogCommentExpanded[]
}

export type IBlogWithReview = IBlog & {
    created_by_staff: IStaff & {
        user: IUser
    },
    organization: IOrganization;
    blog_review: IReviewExpanded[]
}

export type IReviewExpanded = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted: boolean | null;
    blog_id: string;
    review: string;
    created_by_staff_id: string;
    created_by_staff: IStaff & {
        user: IUser | null
    } | null;
    blog: IBlog | null;
}

export type IBlogHome = IBlogQuery & {
    organization: IOrganization
}

export type IBlogCommentExpanded = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted: boolean | null;
    comment: string;
    blog_id: string;
    created_by_user_id: string;
    created_by_user: IUser | null;
    blog: IBlog | null;
}

export type IQuery = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    include?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order?: Record<string, any>;
    limit?: number;
    skip?: number;
}