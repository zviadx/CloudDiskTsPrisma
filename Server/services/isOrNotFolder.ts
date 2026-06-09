import fs from "fs"
import "dotenv/config"


class IsOrNotFolder {
    folderExists(Folder: any): Promise<any> {
        const path = `${process.env.FILEPATH}\\${Folder.user}\\${Folder.path}`
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path)
                    return resolve({ message: "operation finished successfully" })
                } else {
                    return reject({ message: "required Folder already exists" })
                }
            } catch (e) {
                return reject("Try Again")
            }
        })
    }
}

export default new IsOrNotFolder()