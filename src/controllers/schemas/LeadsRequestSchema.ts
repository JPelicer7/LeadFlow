import { z } from "zod";

export const getLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: z.enum([ "New", "Contacted", "Qualified", "Converted", "Unresponsive", "Disqualified", "Archived"]).optional(),
    sortBy: z.enum(["name", "status"]).optional(), // Campos permitidos para ordenação
    order: z.enum(["asc", "desc"]).optional()
})

export const CreateLeadsRequestSchema = z.object({ 
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    status: z.enum([ "New", "Contacted", "Qualified", "Converted", "Unresponsive", "Disqualified", "Archived"]).optional(),

})


export const UpdateLeadsRequestSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    status: z.enum([ "New", "Contacted", "Qualified", "Converted", "Unresponsive", "Disqualified", "Archived"]).optional()
})