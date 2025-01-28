import { comparePasswords } from "@/lib/compare-hash-password";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";

export async function credentialsSignIn({ email, password }: {
    email: string;
    password: string;
}): Promise<{
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    username?: string;
    picture?: string;
    auth_type?: $Enums.auth_type_t;
    success: boolean;
}> {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: email,
            }
        })
        // if this account was created using OAuth and the password hasn't been set yet.
        if(user.password == ""){
            return {
                success: false
            }
        }
        console.log("Found user")
        if (await comparePasswords(password, user.password)) {
            return {
                success: true,
                ...user
            }
        } else {
            console.log("passwords did not match")
            return {
                success: false,
            }
        }
    } catch {
        return {
            success: false,
        }
    }
}