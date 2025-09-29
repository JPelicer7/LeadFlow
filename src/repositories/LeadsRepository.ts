
import { Lead, LeadCampaignStatus } from "../generated/prisma"
//import { Lead } from "@prisma/client"


export type LeadStatus = "New" | "Contacted" |"Qualified" | "Converted" | "Unresponsive" | "Disqualified" | "Archived"



export interface LeadWhereParams {
    name?: {
        like?: string // ou contains
        equals?: string
        mode?: "default" | "insensitive"
    }
    status?: LeadStatus
    groupId?: number
    campaignId?: number
    campaignStatus?: LeadCampaignStatus
}


export interface FindLeadsParams {
    where?: LeadWhereParams
    sortBy?: "name" | "status" | "createdAt"
    order?: "asc" | "desc"
    limit?: number
    offset?: number 
    include?: {
        groups?: boolean
        campaigns?: boolean
    }

}


export interface CreateLeadAttributes {
    name: string
    email: string
    phone: string
    status?: LeadStatus
}

export interface LeadsRepository { // nosso contrato
    find:(params: FindLeadsParams) => Promise<Lead[]> // funcao que devolve uma promise, que é um array de Leads
    findById: (id: number) => Promise<Lead | null>
    create: (attributes: CreateLeadAttributes) => Promise<Lead>
    count: (where: LeadWhereParams) => Promise<number>
    updateById: (id: number, attributes: Partial<CreateLeadAttributes>) => Promise<Lead | null> // esse Partail faz com que tudo seja opcional
    deleteById: (id: number) => Promise<Lead | null>
}