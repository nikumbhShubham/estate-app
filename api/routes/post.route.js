import { Router } from "express";
const router = Router()

router.get("/test",(request,response)=>{
    response.json({msg:"router works"})
})

export default router