import { Handler } from "express";
import { Prisma } from "../generated/prisma";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemas/CampaignRequestSchema";
import { prisma } from "../database";
import { LeadCampaignStatus } from "../generated/prisma";
import { CampaignsRepository } from "../repositories/CampaignsRepository";
import { LeadsRepository, LeadWhereParams } from "../repositories/LeadsRepository";


export class CampaignLeadsController {

    constructor(
        private readonly campaignsRepository: CampaignsRepository,
        private readonly leadsRepository: LeadsRepository
  ) { }

    getLeads : Handler = async(req , res, next) => {
        try {
            const campaignId = Number(req.params.campaignId)
            const query = GetCampaignLeadsRequestSchema.parse(req.query)
            const {page = "1", pageSize= "10", name, status, sortBy = "name", order = "asc" } = query

            const limit = Number(pageSize)
            const offset = (Number(page) -1) * limit
            
            /*
            const whereClause : Prisma.LeadWhereInput = {
                campaigns: {
                    some: { campaignId : campaignId}
                }
            } */
            const whereClause : LeadWhereParams = {campaignId, campaignStatus: status}


            if(name) whereClause.name = {like: name, mode: "insensitive"} // filtrar pelo nome
            //if(status) whereClause.campaigns = {some : { campaignId,  status }}

            /*const leads = await prisma.lead.findMany({
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
            })*/
            const leads = await this.leadsRepository.find({
                where: whereClause,
                sortBy,
                order,
                limit,
                offset,
                include: {campaigns: true}
            })

            const total = await this.leadsRepository.count(whereClause)
            
            res.json({leads, 
                meta: {
                page: Number(page),
                pageSize: limit,
                total,
                totalPages: Math.ceil(total/ limit)
            }})

        } catch (error) {
            next(error)
        }
    }

    
    addLeads : Handler = async(req , res, next) => {
        try {
            const campaignId = Number(req.params.campaignId)
            const {leadId, status = "New"} = AddLeadRequestSchema.parse(req.body)
           /* await prisma.leadCampaign.create({
                data: {
                    campaignId: Number(req.params.campaignId),
                    leadId: body.leadId,
                    status: body.status
                }
            }) */
           await this.campaignsRepository.addLead({campaignId, leadId, status})

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
            const campaignId = req.params.campaignId
            const leadId = req.params.leadId
           /* const removedLead = await prisma.leadCampaign.delete({
                where: {
                    leadId_campaignId : {
                        campaignId: Number(req.params.campaignId),
                        leadId: Number(req.params.leadId)
                    }
                }
            }) */

                const removedLead = this.campaignsRepository.removeLead(+campaignId, +leadId)

            res.json(removedLead)
        } catch (error) {
            next(error)
        }
    }

}