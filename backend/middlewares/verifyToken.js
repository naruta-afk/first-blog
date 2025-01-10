const jwt = require('jsonwebtoken');


//verify token
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;
    if(authToken){
        const token = authToken.split(' ')[1];
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }catch(error){
            return res.status(401).json({message:"Ivalid token"});
        }
    }else{
        return res.status(401).json({message:"No token provided , access denied"});
    }
}

// verify token and admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"Access denied"});
        }
    });
}

module.exports = {verifyToken , verifyTokenAndAdmin};