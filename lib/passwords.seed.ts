/* 
    * This file is used to seed the database with initial data. It can be run using the command:
    * npx prisma db seed
    *
    * In this example, we create some initial categories, products, and a user with a hashed password.
    * The hashPassword function uses bcrypt to securely hash the user's password before storing it in the database.
    *
    * You can customize this file to add more seed data as needed for your application.
    *
    * Note: Make sure to run this script only in development or testing environments, as it will delete existing data.
*/
import bcrypt from "bcryptjs"

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}