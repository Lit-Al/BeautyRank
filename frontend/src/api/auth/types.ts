export interface ILoginRequest{
    phone_number: string,
    code: string
}

export interface ILoginResponse{
    accessToken: string
}