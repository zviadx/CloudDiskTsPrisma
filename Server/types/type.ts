export interface IFolder {
    user?: number
    path?: string
}

export interface IFile {
    name?: string
    size?: number
    path?: string
    type?: string
    userId?: number
    parentId?: string
}
export interface IAuth {
    email?: string
    password?: string
}
