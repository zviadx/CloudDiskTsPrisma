export interface IFileSlice {
    files?: string[],
    currentDir?: string | null,
    dirStack?: string[],
    modal: boolean
}


export interface ICurrentUser {
    id?: number,
    email?: string,
    diskSpace?: bigint,
    usedSpace?: bigint,
    avatar?: string,
    path?: string,
}

export interface IUserSlice {
    currentUser: ICurrentUser,
    isAuth: boolean
}


export interface IUploadFiles {
    name?: string,
    progress?: number,
    id?: number
}

export interface IUploadSlice {
    isVisible?: boolean,
    files?: IUploadFiles[]
}
