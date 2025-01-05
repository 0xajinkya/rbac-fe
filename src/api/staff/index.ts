import { IResponse, IStaff, IStaffQuery } from "@interfaces/common";
import http from "@utils/axios";

const List = async (organization_id?: string | null) => {
    const response = await http.post<IResponse<IStaffQuery[]>>(`/staff/query`, {
        where: {
            deleted: false,
            organization_id: organization_id
        },
        include: {
            user: true
        }
    }, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
};

const Delete = async (id: string, organization_id?: string | null) => {
    const response = await http.delete<IResponse<IStaff>>(`/staff/${id}`, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const GetMe = async (organization_id?: string | null) => {
    const response = await http.get<IResponse<IStaff>>(`/staff/me`, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

const Add = async(user_id: string, role_id: "super_admin" | "admin" | "editor" | "reviewer", organization_id?: string | null) => {
    const response = await http.post<IResponse<IStaffQuery>>(`/staff`, {
        user_id,
        role_id,
    }, {
        headers: {
            "X-Org": organization_id
        }
    });
    return response.data;
}

export const StaffApi = {
    List,
    Delete,
    GetMe,
    Add
}