import { ICreateOrgFormState, IMemberOrganization, IOrganization, IOrganizationLogin, IResponse, IStaff } from "@interfaces/common";
import http from "@utils/axios";

const Create = async (data: ICreateOrgFormState) => {
    const response = await http.post<IResponse<{organization: IOrganization, staff: IStaff}>>("/organization", data);
    return response.data;
}

const Get = async (id: string) => {
    const response = await http.get<IResponse<IOrganization>>(`/organization/${id}`);
    return response.data;
}

const ListMemberOrganizations = async () => {
    const response = await http.get<IResponse<IMemberOrganization[]>>(`/organization/get-member-organizations`);
    return response.data;
}

const LoginToOrganization = async (organization_id: string) => {
    const response = await http.post<IResponse<IOrganizationLogin>>(`/organization/${organization_id}/login`);
    return response.data;
}

export const OrgApi = {
    Create,
    Get,
    ListMemberOrganizations,
    LoginToOrganization
}