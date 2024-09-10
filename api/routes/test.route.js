import { Router } from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller";
const router = Router()

router.get("/should-be-looged-in",shouldBeLoggedIn)
router.get("/should-be-admin",shouldBeAdmin)

export default router