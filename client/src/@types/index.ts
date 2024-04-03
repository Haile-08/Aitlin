export interface successPropsType {
    link: string,
    info: string
}

export interface userDataTypes {
    email: string,
    password: string,
}

export interface resetDataTypes {
    userId: string | undefined,
    token: string | undefined,
    password: string,
}