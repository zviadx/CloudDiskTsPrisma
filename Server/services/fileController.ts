// import {Collection as User} from "mongodb/src/collection";

import "dotenv/config"
import { Request, Response, NextFunction } from 'express'
import { Prisma } from "@prisma/client"
import fs from "fs"
import userFolder from "./userFolder"
import isOrNotFolder from "./isOrNotFolder"
import fileServices from "./fileDelete"
import { v4 as uuid } from "uuid"
import prisma from "../db/prisma"


class fileController {
    async createFF(req: Request, res: Response) {
        if (req.body.type === "dir") {
            try {
                const { name, type, parent } = req.body
                const currUser = await prisma.user.findUnique({
                    where: { id: req.user!.id }
                })
                const file = await prisma.file.create({
                    data: {
                        name,
                        type,
                        parentId: parent ?? null,
                        userId: currUser!.id
                    }
                })

                const parentFolder = await prisma.file.findUnique({
                    where: { id: parent }
                })

                if (parentFolder) {
                    const updatedFile = await prisma.file.update({
                        where: { id: file.id },
                        data: { path: `${parentFolder.path}\\${name}` }
                    })

                    await userFolder.createUserFolder(updatedFile)

                    return (res.json({ file: updatedFile }))
                } else {
                    const updatedFile = await prisma.file.update({
                        where: { id: file.id },
                        data: { path: name }
                    })

                    await userFolder.createUserFolder(updatedFile)

                    return (res.json({ file: file }))
                }


            } catch (err: any) {
                return res.status(400).json({ message: err.message })
            }
        } else {
            res.status(400).json({ message: "You can't create file" })
        }
    }


    async getFiles(req: Request, res: Response) {
        try {
            const { sort } = req.query
            let files

            switch (sort) {
                case "name":
                    files = await prisma.file.findMany({
                        where: {
                            userId: req.user!.id,
                            parentId: req.query.parent as string ?? null
                        },
                        orderBy: { name: "asc" }
                    })
                    break
                case "type":
                    files = await prisma.file.findMany({
                        where: {
                            userId: req.user!.id,
                            parentId: req.query.parent as string ?? null
                        },
                        orderBy: { type: "asc" }
                    })
                    break
                case "size":
                    files = await prisma.file.findMany({
                        where: {
                            userId: req.user!.id,
                            parentId: req.query.parent as string ?? null
                        },
                        orderBy: { size: "asc" }
                    })
                    break
                case "date":
                    files = await prisma.file.findMany({
                        where: {
                            userId: req.user!.id,
                            parentId: req.query.parent as string ?? null
                        },
                        orderBy: { createdAt: "asc" }
                    })
                    break
                default:
                    files = await prisma.file.findMany({
                        where: {
                            userId: req.user!.id,
                            parentId: req.query.parent as string ?? null
                        }
                    })
                    break
            }

            return res.json(files)

        } catch (err) {
            return res.status(400).json({ message: "Please" })
        }
    }


    async fileUpload(req: Request, res: Response) {
        try {
            const file: any = req.files
            const user = await prisma.user.findUnique({ where: { id: req.user!.id } })

            if (user!.usedSpace + file.size > user!.diskSpace!) {
                return res.status(400).json({ message1: "There is not enough space to save the file. Please free up some space on your disk." })
            }

            // user!.usedSpace = user!.usedSpace + file.size
            // const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })

            await prisma.user.update({
                where: { id: user!.id },
                data: {
                    usedSpace: user!.usedSpace! + file.size
                }
            })

            const parent = await prisma.file.findUnique({
                where: {
                    id: req.body.parent,
                    userId: req.user!.id
                }
            })

            let path;
            let filePath
            if (parent) {
                path = `${process.env.FILE_PATH}\\${user!.id}\\${parent.path}\\${file.name}`
                filePath = `${parent.path}\\${file.name}`
            } else {
                path = `${process.env.FILE_PATH}\\${user!.id}\\${file.name}`
                filePath = `${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(500).json({ message2: "A file with that name already exists. Do you want to replace it?" })
            }
            await file.mv(path)
            const type = file.name.split(".").pop()


            const dbFile = await prisma.file.create({
                data: {
                    name: file.name,
                    type,
                    size: file.size,
                    path: filePath,
                    userId: user!.id,
                    parentId: parent?.id ?? null
                }
            })

            res.json(dbFile)


        } catch (err: any) {
            return res.status(500).json({ message3: err.message })
        }
    }

    async fileDownload(req: Request, res: Response) {
        try {
            const file = await prisma.file.findUnique({
                where: {
                    id: req.query.file as string,
                    userId: req.user!.id
                }
            })
            const path = `${process.env.FILE_PATH}\\${req.user!.id}\\${file!.path}`
            if (fs.existsSync(path)) {
                return res.download(path, file!.name)
            }
            return res.status(500).json({ message: "Download Error" })
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }

    async fileDelete(req: Request, res: Response) {
        try {

            const file = await prisma.file.findUnique({
                where: {
                    id: req.query.id as string,
                    userId: req.user!.id
                }
            })
            if (!file) {
                return res.status(400).json({ message: 'No such file exists. Please refresh the page and try again.' })
            }
            await fileServices.fileDeleter(file)
            await prisma.file.delete({
                where: {
                    id: file.id
                }
            })
            res.status(200).json({ message: 'File successfully deleted' })

        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }

    async fileSearch(req: Request, res: Response) {
        try {
            const files = await prisma.file.findMany({
                where: {
                    userId: req.user!.id,
                    name: {
                        contains: req.query.name as string
                    }
                }
            })
            return res.json(files)
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }

    async uploadAvatar(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user!.id
                }
            })
            const file: any = req.files
            const avatarName = uuid() + '.svg'
            const avatarPath = `${process.env.FILE_PATH}\\${avatarName}`
            await file.mv(avatarPath)
            await prisma.user.update({
                where: {
                    id: req.user!.id
                },
                data: {
                    avatar: avatarName
                }
            })
            return res.json(user)
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }

    async deleteAvatar(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user!.id
                }
            })
            if (!user!.avatar) {
                return res.json({ message: "No avatar found" })
            }
            const avPath = `${process.env.FILE_PATH}\\${user!.avatar}`
            await prisma.user.update({
                where: {
                    id: req.user!.id
                },
                data: {
                    avatar: null
                }
            })
            fs.unlinkSync(avPath)
            return res.json(user)
        } catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }

    async createFolder(req: Request, res: Response) {
        try {
            const { folder, parentFolderId } = req.body
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user!.id
                }
            })
            let Folder = await prisma.file.create({
                data: {
                    name: folder,
                    type: "dir",
                    size: 888,
                    userId: user!.id,
                    parentId: parentFolderId
                }
            })
            console.log(Folder)
            let path
            if (!parentFolderId) {
                path = folder
                await prisma.file.update({
                    where: {
                        id: Folder.id
                    },
                    data: {
                        path: path,
                        parentId: null
                    }
                })
                // await isOrNotFolder.folderExists(Folder)
                return (res.status(200).json({ Folder: Folder }))
            } else {
                const parent = await prisma.file.findUnique({
                    where: {
                        id: parentFolderId
                    }
                })
                path = `${parent!.path}\\${folder}`
                await prisma.file.update({
                    where: {
                        id: Folder.id
                    },
                    data: {
                        path: path,
                        parentId: parent!.id
                    }
                })
                await isOrNotFolder.folderExists(Folder)
                return (res.status(200).json({ Folder: Folder }))
            }

        } catch (e) {
            return res.status(400).json({ message: "A folder with that name already exists. Do you want to replace it?" })
        }
    }

}

export default new fileController()