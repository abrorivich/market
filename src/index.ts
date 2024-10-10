import express, { Application } from "express";
import "dotenv/config"
import { ErrorHandlerMiddleware } from "@middlewares";
import "./config/passport"
import session from "express-session";
import passport from "passport";
import { backetRouter, bookRouter, orderRouter, userRouter } from "@routes";

const app: Application = express()
const PORT = process.env.APP_PORT || 7070

app.use(session({
    secret: "avaz1514",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use("/api", userRouter)
app.use("/api", bookRouter)
app.use("/api", backetRouter)
app.use("/api", orderRouter)
app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)

app.listen(PORT, () => console.log(`PORT: ${PORT}`))