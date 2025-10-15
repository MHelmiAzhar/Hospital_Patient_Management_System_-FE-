import z  from "zod"
export const createAppointmentPatientSchema = z.object({
    doctor_id: z.string().min(1, { message: "Doctor is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
})
    