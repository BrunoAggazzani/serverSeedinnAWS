import { Router } from "express";
import * as authControll from "../controllers/test.controllers.js";
const router = Router();

router.get('/', authControll.login);
router.post('/showDevices', authControll.showDevices);
router.post('/dashboard', authControll.loadDashboard);
//router.get('/loadFile', authControll.loadFile);
//router.post('/upload', authControll.upload);
//router.post('/download', authControll.download);


export default router;