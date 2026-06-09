import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import fileController from '../services/fileController'

const router: Router = Router()


router.post('', authMiddleware, fileController.createFF)
router.get('', authMiddleware, fileController.getFiles)
router.post('/uploader', authMiddleware, fileController.fileUpload)
router.get('/download', authMiddleware, fileController.fileDownload)
router.delete('/delete', authMiddleware, fileController.fileDelete)
router.get('/search', authMiddleware, fileController.fileSearch)
router.post('/upAvatar', authMiddleware, fileController.uploadAvatar)
router.delete('/deleteAvatar', authMiddleware, fileController.deleteAvatar)
router.post('/createFolder', authMiddleware, fileController.createFolder)

export default router