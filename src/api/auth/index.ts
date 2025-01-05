import { IAuthenticationFormState, IGetMeResponse, IResponse, ISignupResponse } from "@interfaces/common";
import http from "@utils/axios";

const Signup = async (data: IAuthenticationFormState) => {
    const response = await http.post<ISignupResponse>("/auth/signup", data);
    return response.data;
}

const Signin = async (data: IAuthenticationFormState) => {
    const response = await http.post<ISignupResponse>("/auth/signin", data);
    return response.data;
}

const GetMe = async () => {
    const response = await http.get<IResponse<IGetMeResponse>>("/auth/me");
    return response.data;
}

const Signout = async () => {
    await http.post("/auth/signout");
}

export const AuthApi = {
    Signup,
    Signin,
    GetMe,
    Signout
}