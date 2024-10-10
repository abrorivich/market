import pasport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import "dotenv/config"

pasport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: process.env.GITUB_REDIRECT_URL as string
}, (access_token: string, refresh_token: string | undefined, profile: any, done: any) => {
    done(null, profile)
}))

pasport.serializeUser((user: any, done) => {
    done(null, user)
})

pasport.deserializeUser((user: any, done) => {
    done(null, user)
})