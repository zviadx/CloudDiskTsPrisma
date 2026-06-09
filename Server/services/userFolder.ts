import fs from "fs"
import "dotenv/config"


class userFolder {

    createUserFolder(Folder: any): Promise<any> {
        const Path = `${process.env.FILEPATH}\\${Folder.user}\\${Folder.path}`
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(Path)) {
                    fs.mkdirSync(Path)
                    return resolve({ message: "Your attemption was finished successfully" })
                }
                else {
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