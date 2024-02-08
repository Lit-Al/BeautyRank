export interface ILoginRequest{
    username: string,
    password: string
}

export interface ISmsRequest{
    phone_number: string,
}

export interface ILoginResponse{
    access: string,
    refresh: string
}