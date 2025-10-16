import z from "zod";
export const createDoctorSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    specialization: z.string().min(1, { message: "Specialization is required" })
})

export const createAppointmentSchema = z.object({
    doctor_id: z.object({
        value: z.number(),
        label: z.string()
    }, { message: "Doctor is required" }),
    patient_id: z.object({
        value: z.number(),
        label: z.string()
    }, { message: "Patient is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
})
export const updateAppointmentSchema = z.object({
    doctor_id: z.object({
        value: z.number(),
        label: z.string()
    }, { message: "Doctor is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
    status: z.enum(['SCHEDULED', 'APPROVED', 'REJECTED', 'COMPLETED']),
})