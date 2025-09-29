import { Campaign } from "../generated/prisma"


export type LeadCampaignStatus = "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Qualified" | "Converted" | "Unresponsive" | "Disqualified" | "Re_Engaged" | "Opted_Out"

export interface CreateCampaignAttributes {
    name: string
    description: string
    startDate: Date
    endDate?: Date
}


export interface FindCampaignsParams {
    where?: number
    sortBy?: "name" | "status" | "createdAt"
    order?: "asc" | "desc"
    limit?: number
    offset?: number 
    include?: {
        leads?: true
    }

}


export interface AddLeadToCampaignAttributes {
  campaignId: number
  leadId: number
  status: LeadCampaignStatus
}




export interface CampaignsRepository {
    find: () => Promise<Campaign[]>
    findById: (id: number) => Promise<Campaign | null>
    create: (attributes: CreateCampaignAttributes) => Promise<Campaign>
    updateById: (id:number, attributes: Partial<CreateCampaignAttributes>) => Promise<Campaign | null>
    deleteById: (id:number) => Promise<Campaign | null>
    addLead: (attributes: AddLeadToCampaignAttributes) => Promise<void>
    removeLead: (campaignId: number, leadId: number) => Promise<void>
    updateLeadStatus: (attributes: AddLeadToCampaignAttributes) => Promise<void>
}




/*
export interface GroupRepository {
    find: () => Promise<Group[]>
    findById: (id: number) => Promise<Group | null>
    create: (attributes: CreateGroupAttributes) => Promise<Group>
    updateById: (id: number, attributes: Partial<CreateGroupAttributes>) => Promise<Group | null>
    deleteById: (id:number) => Promise<Group | null>
    addLead : (groupId: number, leadId: number) => Promise<Group>
    removeLead: (groupId: number, leadId: number) => Promise<Group>
}
*/