import { Handler } from "express";
import { AddGroupLeadRequestSchema, GetGroupLeadRequestSchema } from "./schemas/GroupRequestSchema";
import { Prisma } from "../generated/prisma";
import { prisma } from "../database";

export class GroupLeadController  {

    getLeads: Handler = async(req, res, next) => { // mostrar os leads de um grupo
        
       try {
        const groupId = Number(req.params.groupId)
        const query = GetGroupLeadRequestSchema.parse(req.query)

        const {page = "1", pageSize= "10", name, sortBy = "name", order = "asc" } = query

        const pageNumber = Number(page)
        const pageSizeNumber = Number(pageSize)


        const whereClause : Prisma.LeadWhereInput = {
            groups: {
                some : {id: groupId}
            }
        }

        if(name) whereClause.name = {contains: name, mode: "insensitive"}

        const leads = await prisma.lead.findMany({
            where: whereClause, // ele vai fzer isso no where do whereClause, que é o groupId passado nos params
            orderBy: {[sortBy]: order},
            skip: (pageNumber - 1) * (pageSizeNumber),
            take: pageSizeNumber,
            include : { // incluindo da tabela Lead, entrando na tabela group e selecionando os dados que eu quero dela
                groups : {
                    select : {
                        id: true,
                        name: true
                    }
                }
            }
        })

        res.json(leads)
       } catch (error) {
            next(error)
       } 

    }


    addLead: Handler = async (req, res, next) => {
    
        try {
            const body = AddGroupLeadRequestSchema.parse(req.body)
            const updatedGroup =  await prisma.group.update({
                where: {
                    id: Number(req.params.groupId)
                },
                data: {
                    leads: {
                        connect : {id: body.leadId}
                    }
                },
                include: {
                    leads : {
                        select: {
                            name: true                            
                        }
                    }
                }
            })

        res.json(updatedGroup)
            
        } catch (error) {
            next(error)
        }
       
    }


    removeLead: Handler = async (req, res, next) => {
        try {
            const removedLead = await prisma.group.update({
                where: {
                    id : Number(req.params.groupId)
                },
                data: {
                    leads : {
                        disconnect : {
                            id: Number(req.params.leadId)
                        }
                    }
                },

                include: {
                    leads: true
                }
        })

        res.json(removedLead)
        } catch (error) {
            next(error)
        }

        

    }
}
