import { Handler } from "express";
import { Prisma } from "../generated/prisma";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignRequestSchema";
import { prisma } from "../database";
import { LeadCampaignStatus } from "../generated/prisma";



export class CampaignLeadsController {

    getLeads : Handler = async(req , res, next) => {
        try {
            const campaignId = Number(req.params.campaignId)
            const query = GetCampaignLeadsRequestSchema.parse(req.query)
            const {page = "1", pageSize= "10", name, status, sortBy = "name", order = "asc" } = query

            const pageNumber = Number(page)
            const pageSizeNumber = Number(pageSize)

            const whereClause : Prisma.LeadWhereInput = {
                campaigns: {
                    some: { campaignId : campaignId}
                }
            }


            if(name) whereClause.name = {contains: name, mode: "insensitive"} // filtrar pelo nome
            if(status) whereClause.campaigns = {some : { campaignId,  status }}

            const leads = await prisma.lead.findMany({
                where: whereClause,
                orderBy: {[sortBy]: order},
                skip: (pageNumber - 1) * (pageSizeNumber),
                take: pageSizeNumber,
                include: {
                    campaigns: {
                        select: {
                            campaignId : true,
                            leadId: true,
                            status: true
                        }
                    }
                }
            })

            const total = await prisma.lead.count({where: whereClause})
            res.json({leads, 
                meta: {
                page: pageNumber,
                pageSize: pageSizeNumber,
                total,
                totalPages: Math.ceil(total/ pageSizeNumber)
            }})

        } catch (error) {
            next(error)
        }
    }

    
    addLeads : Handler = async(req , res, next) => {
        try {
            const body = AddLeadRequestSchema.parse(req.body)
            await prisma.leadCampaign.create({
                data: {
                    campaignId: Number(req.params.campaignId),
                    leadId: body.leadId,
                    status: body.status
                }
            })

            res.status(201).end()
        } catch (error) {
            next(error)
        }
    }

    updateLeadStatus : Handler = async(req , res, next) => {
        try {
            const body = UpdateLeadStatusRequestSchema.parse(req.body)
            const updatedStatus = await prisma.leadCampaign.update({
                data: body,
                where: {
                    leadId_campaignId: {
                        campaignId: Number(req.params.campaignId),
                        leadId: Number(req.params.leadId)
                    }
                }
            })

            res.json(updatedStatus)
        } catch (error) {
            next(error)
        }
    }


    deleteLead : Handler = async(req , res, next) => {
        try {
            const removedLead = await prisma.leadCampaign.delete({
                where: {
                    leadId_campaignId : {
                        campaignId: Number(req.params.campaignId),
                        leadId: Number(req.params.leadId)
                    }
                }
            })

            res.json(removedLead)
        } catch (error) {
            next(error)
        }
    }

}