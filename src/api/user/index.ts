import { IResponse, IUser } from "@interfaces/common";
import http from "@utils/axios";

const ListUserToAdd = async (organization_id?: string | null) => {
    if (organization_id) {
        const response = await http.get<IResponse<IUser[]>>(`/user/${organization_id}/add-in-organization`, {
            headers: {
                "X-Org": organization_id
            }
        });
        return response.data;
    }
    return {
        content: {
            data: []
        }
    };
}

export const UserApi = {
    ListUserToAdd
}