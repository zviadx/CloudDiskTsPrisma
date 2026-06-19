import fs from "node:fs"
import "dotenv/config"
import type { IFolder } from "../types/type"

class userFolder {

    createUserFolder(Folder: IFolder): Promise<{ message: string }> {
        const Path = `${process.env.FILEPATH}\\${Folder.user}\\${Folder.path}`
        console.log(Path)
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(Path)) {
                    fs.mkdirSync(Path)
                    console.log("Folder created successfully")
                    return resolve({ message: "Your attemption was finished successfully" })
                }
                else {
                    console.log("Folder already exists")
                    return reject({ message: "sorry, but we have good news that We are pleasure to see you again" })
                }
            } catch (err: any) {
                return reject({ message: err.message })
            }
        }

        )
    }
}

export default new userFolder()