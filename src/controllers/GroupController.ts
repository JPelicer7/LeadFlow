import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "../generated/prisma";
import { createGrouRequestSchema, updateGroupRequestSchema } from "./schemas/GroupRequestSchema";
import { GroupRepository } from "../repositories/GroupRepository";



export class GroupController {

    constructor(private readonly groupsRepository: GroupRepository) { } // abreviacao do metodo usado em LeadsController, mesma coisa



    index: Handler = async (req, res, next) => {
        try {
            //const groups = await prisma.group.findMany()
            const groups = await this.groupsRepository.find()
            res.json(groups)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = createGrouRequestSchema.parse(req.body)
            /*const newGroup = await prisma.group.create({
                data: body
            }) */
           const newGroup = await this.groupsRepository.create(body)

            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res , next) => {
        try {
            const id = req.params.id

           /* const group = await prisma.group.findUnique({
                where: {id: +id},
                include: {
                    leads: true
                }
            })*/

            const group = await this.groupsRepository.findById(+id)
            if(!group) throw new HttpError(401, "Group Not found")
            
            res.json(group)
            
        } catch (error) {
            next(error)
        }
    

    }


    update: Handler = async (req, res , next) => {
        try {
            const body = updateGroupRequestSchema.parse(req.body)
            const id = req.params.id

           // const groupExists = await prisma.group.findUnique({where : {id: +id}})
           
           const updatedGroup = await this.groupsRepository.updateById(+id, body)
            if(!updatedGroup) throw new HttpError(404, "Group Not Found")
            
            /*const updatedGroup = await prisma.group.update({
                data: body,
                where: {
                    id: +id
                }
            }) */

            res.json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async(req ,res, next) => {
        try {
            const id = req.params.id  
           // const deletedGroup = await prisma.group.delete({where: {id: +id}})
            const deletedGroup = await this.groupsRepository.deleteById(+id)

            res.json(deletedGroup)
        } catch (error) {
            next(error)
        }
    }

}