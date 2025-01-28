import { credentialsSignIn } from "@/actions/sign-in"
import { signUpActionFromGithubFlow, signUpActionFromGoogleFlow } from "@/actions/sign-up"
import { Console } from "console"
import { randomUUID } from "crypto"
import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name?: string | null;
      image?: string | null;
      token?: string; // the new token property for this app, to communicate to the backend
    };
  }
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
          // name: "Credentials",
          credentials: {
            email: {label: "Email", type: "email", placeholder: "johndoe@mail.com"},
            password: {label:"Password", type: "password"}
          },
          authorize: async (credentials, req) => {
            console.log("from inside of the credentials provider", credentials, req)
            const user = await credentialsSignIn({
              email: credentials?.email as string,
              password: credentials?.password as string
            })
            if(user.success) {
              console.log("Signi n success")
              return {
                id: user.username,
                email: user.email,
                image: user.picture,
                name: user.name
              } as User
            }
            return null;
          },
        }),
        GithubProvider({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          if(account?.provider == "google"){
            const canProceed = await signUpActionFromGoogleFlow({
              email: user.email!,
              name: user.name!,
              image: user.image!
            })
            return canProceed;
          }
          if(account?.provider == "github"){
            const canProceed = await signUpActionFromGithubFlow({
              email: user.email!,
              name: user.name!,
              image: user.image!
            })
            return canProceed;
          }
          return true
        },
        async redirect({ url, baseUrl }) {
          return baseUrl
        },
        async session({ session, token, user }) {
          const jwtToken = jwt.sign({
            email: session.user?.email
          }, process.env.NEXTAUTH_SECRET as string, {expiresIn: "1h"})
          session.user!.token = jwtToken
          return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
          // return {...token, ...user}
          return token
        }
      },
      pages: {
        signIn: "/signin"
      },
      session: {
        strategy: 'jwt',
      }
})

export {handler as GET, handler as POST}