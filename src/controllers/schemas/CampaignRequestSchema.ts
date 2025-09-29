
import {z} from "zod"



export const createCampaignRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
    //startDate: z.string(), // nessa ele ira receber a string e converter dps no codigo
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional() // aqui dois métodos de fazer o date, nessa ele vai tentar converter para date
    //endDate: z.string()
})

export const updateCampaignRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    //startDate: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
})


const LeadCampaignStatusSchema = z.enum([
  "New",
  "Engaged",
  "FollowUp_Scheduled",
  "Contacted",
  "Qualified",
  "Converted",
  "Unresponsive",
  "Disqualified",
  "Re_Engaged",
  "Opted_Out"
])



export const GetCampaignLeadsRequestSchema = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    status: LeadCampaignStatusSchema.optional(),
    sortBy: z.enum(["name", "createdAt"]).optional(), // Campos permitidos para ordenação
    order: z.enum(["asc", "desc"]).optional()
})


export const AddLeadRequestSchema = z.object({
    leadId: z.number(),
    status: LeadCampaignStatusSchema.optional() // pq no banco tem um valor default setado,

})


export const UpdateLeadStatusRequestSchema = z.object({
    status: LeadCampaignStatusSchema
})