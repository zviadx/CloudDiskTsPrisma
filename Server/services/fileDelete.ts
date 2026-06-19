import fs from "fs"
import "dotenv/config"
import type { IFile, IFolder } from "../types/type"



class fileServices {

    getPath(file: IFolder): string | undefined {
        return `${process.env.FILEPATH}\\("filePath")}\\${file.user}\\${file.path}`
    }

    fileDeleter(file: any) {
        const path: string | undefined = this.getPath(file)
        console.log("Path: ", path)
        if (file.type === "dir") {
            fs.rmdirSync(path!)
        } else {
            fs.unlinkSync(path!)
        }
    }

}

export default new fileServices()