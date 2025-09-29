import { Handler } from "express";
//import { prisma } from "../database";
import { CreateLeadsRequestSchema, UpdateLeadsRequestSchema, getLeadsRequestSchema } from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
//import { Prisma } from "../generated/prisma";
import { LeadsRepository, LeadWhereParams } from "../repositories/LeadsRepository";
import { LeadsService } from "../services/LeadsService";

//import { PrismaClient } from "../generated/prisma";

export class LeadController {
    /*
    private leadsRepository: LeadsRepository
    constructor(leadsRepository: LeadsRepository) { após fzer as regras de negocios, esse contructor muda
        this.leadsRepository = leadsRepository
    } */ 

    constructor(private readonly leadsService: LeadsService){}

    index: Handler = async (req, res, next) => {
        try {
            const query = getLeadsRequestSchema.parse(req.query) //implementar pafginação, filtro e ordenação   
            const {page = "1", pageSize = "10"} = query
           // const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query; // desestruturando a query e setando valores padrao
            // convertendo os valores para Number
            //const pageNumber = Number(page)
            
            //const pageSizeNumber = Number(pageSize) virou o limit
            const result = await this.leadsService.getAllLeadsPaginated(
                {name: query.name, 
                    status: query.status, 
                    page: +page, 
                    pageSize: +pageSize, 
                    sortBy: query.sortBy, 
                    order: query.order
                }
            )
            
            /*
            const leads = await prisma.lead.findMany({
                where: whereClause,
                skip: (pageNumber - 1) * (pageSizeNumber),
                take: pageSizeNumber,
                orderBy: {[sortBy]: order} // ordenação dinâmica, pegando o valor do sortBy e order (asc ou desc)
            }) */

            

            //const totalLeads = await prisma.lead.count({where: whereClause}) // contando o total de leads para paginação

            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req,res, next) => {
        try {
            const body = CreateLeadsRequestSchema.parse(req.body)

           /* const newLead = await prisma.lead.create({
                data: body
            }) */

           // const newLead = await this.leadsRepository.create(body)

            const newLead = await this.leadsService.createLead(body)

            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const id = req.params.id
            /*
            const lead = await prisma.lead.findUnique({
                where: {
                    id: +id
                },
                include: {
                    groups: true,
                    campaigns: true
                }
            })*/
            const lead = await this.leadsService.getLeadById(+id)
            //const lead = await this.leadsRepository.findById(+id)
            //if(!lead) throw new HttpError(404, "lead não encontrado")


            res.json(lead)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const body = UpdateLeadsRequestSchema.parse(req.body)
            const id = req.params.id
            //lead salvo no banco de dados
           // const lead = await prisma.lead.findUnique({where:{ id: +id}})
          // const lead = await this.leadsRepository.findById(+id)
           // if(!lead) throw new HttpError(404, "Lead not found")
            
           /* if(lead.status === "New" && body.status !== "Contacted"){
                throw new HttpError(400,"O lead deve ter seus status Contacted antes de receber outro")
            } */

            // Valida a inatividade nesse lead em casa de arquivamente 6 meses
           /* if (body.status === "Archived") {
                const now = new Date() // cria a data atual
                const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime()) // diminui a data atual da ultima data de atualizaçao
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // e compara se da 6 meses
                if (diffDays < 180) throw new HttpError(400, "um lead só pode ser arquivado após 6 meses de inatividade")
            } */



           /* const updatedLead = await prisma.lead.update({
                data: body,
                where: {id: +id}
            }) */
          //  const updatedLead = await this.leadsRepository.updateById(+id, body)


           // if(!updatedLead) throw new HttpError(404, "lead não encontrado")
            const updatedLead = await this.leadsService.updateLead(+id, body)


            res.json(updatedLead)
        } catch (error) {
            next(error)
        }
    }




    delete: Handler = async (req, res, next) => {
        try {
            /*
            const deletedLead = await prisma.lead.delete({
                where: {
                    id: Number(req.params.id)
                }
            }) */

           // const deletedLead = await this.leadsRepository.deleteById(Number(req.params.id))

             //if(!deletedLead) throw new HttpError(404, "lead não encontrado")
            const deletedLead =  await this.leadsService.deleteLead(Number(req.params.id))
            res.json(deletedLead)
        } catch (error) {
            next(error)
        }
    }


}