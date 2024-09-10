import jwt from "jsonwebtoken"

export const shouldBeLoggedIn=async(req,res)=>{
        const token=req.cookies.token;
        if(!token)return res.status(401).json({msg:"not authenticated"})
        
            jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
                if(err)return res.status(401).json({msg:"not authenticated"});
            })

        }
export const shouldBeAdmin=async(req,res)=>{

}