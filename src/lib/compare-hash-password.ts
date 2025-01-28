import bcrypt from "bcrypt"

export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
};