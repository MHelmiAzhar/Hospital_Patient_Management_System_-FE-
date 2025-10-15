import z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    address: z.string().min(1, { message: "Address is required" }),
    birth_date: z.string().min(1, { message: "Birth date is required" }),
    gender: z.string().refine(val => val === "MALE" || val === "FEMALE", { message: "Gender is required" }),
    contact_number: z.string().min(1, { message: "Contact number is required" })
})

export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password must be at least 6 characters" }),
})