'use server'

import { hashPassword } from "@/lib/hash-password"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function signUpActionFromForm({email, username, password, name}: {
    email: string,
    username: string,
    password: string,
    name: string
}){
    if(!email || !name || !password || !username) {
        return {success: false}
    }
    console.log(email, name, password, username)
    try{
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
                picture: "",
                username: username,
                auth_type: "Email"
            }
        })
        return {
            success: true
        }
    } catch(error){
        console.log("Error while creating a user")
        return {
            success: false
        }
    }
}

export async function signUpActionFromGoogleFlow({email, name, image}: {
    email: string,
    name: string,
    image: string
}): Promise<boolean> {
    try {
        // email is always unique, so it throws error only if it is not present
        await prisma.user.findUniqueOrThrow({
            where: {
                email: email,
                // authType: "Google" // allow users from anywhere, even github or google to log in to this, with same email id
            }
        })
        return true;
    } catch (error) {
        try {
            const user = await prisma.user.create({
                data: {
                    auth_type: "Google",
                    email: email,
                    name: name,
                    password: "",
                    picture: image,
                    username: randomUUID().toString()
                }
            })
            console.log("created", user)
            return true;
        } catch(error) {
            return false
        }
    }
}

export async function signUpActionFromGithubFlow({email, name, image}: {
    email: string,
    name: string,
    image: string
}): Promise<boolean> {
    try {
        // email is always unique, so it throws error only if it is not present
        await prisma.user.findUniqueOrThrow({
            where: {
                email: email,
                // authType: "Github" // allow users from same email id with any other platform account
            }
        })
        return true;
    } catch (error) {
        try {
            const user = await prisma.user.create({
                data: {
                    auth_type: "Github",
                    email: email,
                    name: name,
                    password: "",
                    picture: image,
                    username: randomUUID().toString()
                }
            })
            console.log("created", user)
            return true;
        } catch(error) {
            return false
        }
    }
}

export async function isUsernameAvailable(){
    // implement this in golang lambda function
}

export async function isEmailTaken(){
    // implement this in golang lambda function
}