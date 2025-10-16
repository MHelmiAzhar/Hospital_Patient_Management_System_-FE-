import z  from "zod"
export const createAppointmentPatientSchema = z.object({
    doctor_id: z.object({
        value: z.number(),
        label: z.string()
    }, { message: "Doctor is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
})
    