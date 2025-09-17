import { Handler } from "express";
import { prisma } from "../database";
import { CreateLeadsRequestSchema, UpdateLeadsRequestSchema, getLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "../generated/prisma";
//import { PrismaClient } from "../generated/prisma";

export class LeadController {
    index: Handler = async (req, res, next) => {
        try {
            const query = getLeadsRequestSchema.parse(req.query) //implementar pafginação, filtro e ordenação   

            const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query; // desestruturando a query e setando valores padrao
            // convertendo os valores para Number
            const pageNumber = Number(page)
            const pageSizeNumber = Number(pageSize)
        
            const whereClause : Prisma.LeadWhereInput = {} 
            if(name) whereClause.name = { contains: name, mode: "insensitive"} // filtrar por nome
            if(status) whereClause.status = status
            
            const leads = await prisma.lead.findMany({
                where: whereClause,
                skip: (pageNumber - 1) * (pageSizeNumber),
                take: pageSizeNumber,
                orderBy: {[sortBy]: order} // ordenação dinâmica, pegando o valor do sortBy e order (asc ou desc)
            })

            const totalLeads = await prisma.lead.count({where: whereClause}) // contando o total de leads para paginação

            res.json({
                data: leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    totalLeads,
                    totalPages: Math.ceil(totalLeads / pageSizeNumber)
                }
            })
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req,res, next) => {
        try {
            const body = CreateLeadsRequestSchema.parse(req.body)
            const newLead = await prisma.lead.create({
                data: body
            })
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = req.params.id
            const lead = await prisma.lead.findUnique({
                where: {
                    id: +id
                },
                include: {
                    groups: true,
                    campaigns: true
                }
            })

           if(!lead) throw new HttpError(404, "lead não encontrado")

            res.json(lead)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const body = UpdateLeadsRequestSchema.parse(req.body)
            const id = req.params.id

            const leadsExists = await prisma.lead.findUnique({where:{ id: +id}})
            if(!leadsExists) throw new HttpError(404, "Lead not found")
                
            const updatedLead = await prisma.lead.update({
                data: body,
                where: {id: +id}
            })

            if(!updatedLead) throw new HttpError(404, "lead não encontrado")

            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }




    delete: Handler = async (req, res, next) => {
        try {
            const deletedLead = await prisma.lead.delete({
                where: {
                    id: Number(req.params.id)
                }
            })

             if(!deletedLead) throw new HttpError(404, "lead não encontrado")

            res.json(deletedLead)
        } catch (error) {
            next(error)
        }
    }


}