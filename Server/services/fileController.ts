// import {Collection as User} from "mongodb/src/collection";

import "dotenv/config"
import { Request, Response, NextFunction } from 'express'
import File from "../models/File"
import User from "../models/User"
import fs from "fs"
import userFolder from "./userFolder"
import isOrNotFolder from "./isOrNotFolder"
import fileServices from "./fileDelete"
import Uuid from "uuid"


class fileController {
    async createFF(req: Request, res: Response) {
        if (req.body.type === "dir") {
            try {
                const { name, type, parent } = req.body
                const file = new File({ name, type, parent })
                const currUser = await User.findOne({ _id: req.user.id })
                file.user = currUser._id

                const parentFolder = await File.findOne({ _id: parent })

                if (parentFolder) {
                    file.path = `${parentFolder.path}\\${name}`
                    await parentFolder.childs.push(file.id)
                    await parentFolder.save()
                    await file.save()
                    await userFolder.createUserFolder(file)

                    return (res.json({ file }))
                } else {
                    file.path = name
                    currUser.files.push(file.id)
                    file.parent = null
                    await currUser.save()
                    await file.save()
                    await userFolder.createUserFolder(file)

                    return (res.json({ file: file }))
                }


            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
        } else {
            res.status(400).json({ message: "You can't create file" })
        }
    }


    async getFiles(req, res) {
        try {
            const { sort } = req.query
            let files

            switch (sort) {
                case "name":
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 })
                    break
                case "type":
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 })
                    break
                case "size":
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ size: 1 })
                    break
                default:
                    files = await File.find({ user: req.user.id, parent: req.query.parent })
                    break
            }

            // const files = await File.find({user: req.user.id, parent: req.query.parent})
            // console.log(files)
            return res.json(files)

        } catch (err) {
            return res.status(400).json({ message: "Please" })
        }
    }


    async fileUpload(req, res) {
        try {
            const file = req.files.file
            const user = await User.findOne({ _id: req.user.id })
            // console.log(user._id)

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message1: "There is not enough space to save the file. Please free up some space on your disk." })
            }

            user.usedSpace = user.usedSpace + file.size
            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })

            let path;
            let filePath
            if (parent) {
                path = `${config.get("filePath")}\\${user._id}\\${parent.path}\\${file.name}`
                filePath = `${parent.path}\\${file.name}`
            } else {
                path = `${config.get("filePath")}\\${user._id}\\${file.name}`
                filePath = `${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(500).json({ message2: "A file with that name already exists. Do you want to replace it?" })
            }
            await file.mv(path)
            const type = file.name.split(".").pop()

            await user.save()
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                user: user._id,
                parent: parent?._id
            })

            await dbFile.save()
            res.json(dbFile)


        } catch (err) {
            return res.status(500).json({ message3: err.message })
        }
    }

    async fileDownload(req, res) {
        try {
            const file = await File.findOne({ user: req.user.id, _id: req.query.file })
            // const realPath = `${config.get("filePath")}\\${req.user.id}\\${file.path}`
            const path = `${config.get("filePath")}\\${req.user.id}\\${file.path}`
            if (fs.existsSync(path)) {
                return res.download(path, file.name)
            }
            return res.status(500).json({ message: "Download Error" })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: err.message })
        }
    }

    async fileDelete(req, res) {
        try {

            const file = await File.findOne({ user: req.user.id, _id: req.query.id })
            if (!file) {
                return res.status(400).json({ message: 'No such file exists. Please refresh the page and try again.' })
            }
            fileServices.fileDeleter(file)
            // await file.remove()
            await File.findOneAndDelete({ _id: file._id }, { lean: true })
            res.status(200).json({ message: 'File successfully deleted' })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async fileSearch(req, res) {
        try {
            let files = await File.find({ user: req.user.id })
            files = files.filter(file => file.name.includes(req.query.name))
            return res.json(files)
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async uploadAvatar(req, res) {
        try {
            const user = await User.findById({ _id: req.user.id })
            const file = req.files.file
            const avatarName = Uuid.v4() + '.svg'
            const avatarPath = `${config.get("staticPath")}\\${avatarName}`
            await file.mv(avatarPath)
            user.avatar = avatarName
            await user.save()
            return res.json(user)
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById({ _id: req.user.id })
            if (!user.avatar) {
                return res.json({ message: "ავატარკა უკვე აღარ არის, ნე ტიკაი პალცემ" })
            }
            const avPath = `${config.get("staticPath")}\\${user.avatar}`
            user.avatar = null
            fs.unlinkSync(avPath)
            await user.save()
            return res.json(user)
        } catch (err) {
            return res.status(400).json({ message: err.message })
        }
    }

    async createFolder(req, res) {
        try {
            const { folder, parentFolderId } = req.body
            const currUser = await User.findOne({ _id: req.user.id })
            let Folder = await new File({ type: "dir", name: folder, user: currUser._id, size: 888 })
            await currUser.files.push(Folder.id)
            await currUser.save()
            console.log(Folder)
            // Folder.user = currUser._id
            let path

            if (!parentFolderId) {
                path = folder
                Folder.path = path
                console.log("ID IS" + Folder._id)
                Folder.parent = null
                await Folder.save()
                await isOrNotFolder.folderExists(Folder)

                return (res.status(200).json({ Folder: Folder }))
            } else {
                const parent = await File.findOne({ user: currUser._id, _id: parentFolderId })
                path = `${parent.path}\\${folder}`
                Folder.path = path
                console.log(Folder)
                Folder.parent = parent._id
                await Folder.save()
                await parent.childs.push(Folder.id)
                await parent.save()
                await folderExists.folderExists(Folder)

                return (res.status(200).json({ Folder: Folder }))
            }

            // await currUser.save()
            // await parent.save()
            // await Folder.save()
            //
            // return (res.json({Folder: Folder}))

        } catch (e) {
            return res.status(400).json({ message: "A folder with that name already exists. Do you want to replace it?" })
        }
    }

}

module.exports = new fileController()