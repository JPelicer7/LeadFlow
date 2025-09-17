import { z } from "zod";

export const createGrouRequestSchema = z.object({
    name: z.string(),
    description: z.string()
})

export const updateGroupRequestSchema = z.object({ 
    name: z.string().optional(),
    description: z.string().optional()
})

export const GetGroupLeadRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    sortBy: z.enum(["name", "createdAt"]).optional(), // Campos permitidos para ordenação
    order: z.enum(["asc", "desc"]).optional()
})


export const AddGroupLeadRequestSchema = z.object({
    leadId: z.number(),
})