import { Handler } from "express";
import { prisma } from "../database";
import { createCampaignRequestSchema, updateCampaignRequestSchema } from "./schemas/CampaignRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "../generated/prisma";
import { errorHandlerMiddleware } from "../middlewares/error-handler";


export class CampaignsController {

    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await prisma.campaign.findMany()
            res.json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {

        try {
            const {name, description, startDate, endDate} = createCampaignRequestSchema.parse(req.body)
        
            const newCampaign = await prisma.campaign.create({
                data: {
                    name,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                }
            })

            res.status(201).json(newCampaign)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async(req, res, next) => {
        try {
            const id = req.params.id
            const campaignExists = await prisma.campaign.findUnique({where: {id: +id}})
            if(!campaignExists) throw new HttpError(401, "Campaign not found")
            
            const campaign = await prisma.campaign.findUnique({ // metedo de mostrar os dados do lead completo
                where: {id: +id},
                include: {
                    leads: {
                        include: {
                            lead: true
                        }
                    }
                }
            })

            res.json(campaign)

        } catch (error) {
            next(error)
        }
    }

    update: Handler = async(req, res, next) => {
        try {
            const id = req.params.id
            const {name, description, startDate, endDate} = updateCampaignRequestSchema.parse(req.body)

            const campaignExists = await prisma.campaign.findUnique({where: {id: +id}})
            if(!campaignExists) throw new HttpError(404, "Campaign not found")
            
            const updatedCampaign = await prisma.campaign.update({
                data: {
                    name,
                    description,
                    startDate: startDate ? new Date(startDate) : undefined, //verificando para n quebrar
                    endDate: endDate ? new Date(endDate) : undefined
                },
                where: {
                    id: +id
                }
            })
            
            res.json(updatedCampaign)

        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res , next) => {
        const id = req.params.id
        const deletedCampaign = await prisma.campaign.delete({
            where: {id: +id}
        })
        if(!deletedCampaign) throw new HttpError(404, "Campaign Not found")

        res.json(deletedCampaign)
    }

}