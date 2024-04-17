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

interface clientData {
    Name: string | undefined,
    status: string | undefined,
    ServiceData: string | undefined,
    email: string | undefined,
    Notification: boolean | undefined,
}

export interface client {
    data: clientData,
    token: string | undefined,
}

interface firstService {
    serviceId: string,
    serviceName: string,
    clientName: string,
}

export interface userRedux {
    Name: string,
    email: string,
    password: string,
    type: string,
    ServiceNumber: number,
    firstService: firstService,
    date: Date,
}