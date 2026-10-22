
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv"
configDotenv()

const AuthUserCheck = async (req, res, next) => {
  try {
    const token = req.header("auth-token")
    if (!token) {
      return res.status(401).json({
        message: "Token Missing"
      })
    }
    const user = jwt.verify(
      token,
      process.env.SECRET_KEY
    )
    req.id = user.id
    next()
  } catch (error) {
    console.log("JWT ERROR:", error.message)
    return res.status(401).json({
      message: "Invalid Token"
    })
  }
}

export default AuthUserCheck