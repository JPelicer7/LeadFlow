import { Router } from "express"
import { HttpError } from "./errors/HttpError"
import { LeadController } from "./controllers/LeadsController"
import { GroupController } from "./controllers/GroupController"
import { CampaignsController } from "./controllers/CampaignsController"
import { CampaignLeadsController } from "./controllers/CampaignLeadsController"
import { GroupLeadController } from "./controllers/GroupLeadsController"
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository"
import { PrismaGroupsRepository } from "./repositories/prisma/PrismaGroupsRepository"
import { PrismaCampaignRepository } from "./repositories/prisma/PrismaCampaignRepository"
import { LeadsService } from "./services/LeadsService"



const router = Router()

const leadsRepository = new PrismaLeadsRepository()
const groupsRepository = new PrismaGroupsRepository()
const campaignsRepository = new PrismaCampaignRepository()
const leadService = new LeadsService(leadsRepository)

const leadsController = new LeadController(leadService)
const groupController = new GroupController(groupsRepository)
const campaignsController = new CampaignsController(campaignsRepository)
const campaignLeadsController = new CampaignLeadsController(campaignsRepository, leadsRepository)
const groupLeadController = new GroupLeadController(groupsRepository, leadsRepository) 

router.get("/leads", leadsController.index)
router.post("/leads", leadsController.create)
router.get("/leads/:id", leadsController.show)
router.put("/leads/:id", leadsController.update)
router.delete("/leads/:id", leadsController.delete)

router.get("/groups", groupController.index)
router.post("/groups", groupController.create)
router.get("/groups/:id", groupController.show)
router.put("/groups/:id", groupController.update)
router.delete("/groups/:id", groupController.delete)


router.get("/campaigns", campaignsController.index)
router.post("/campaigns", campaignsController.create)
router.get("/campaigns/:id", campaignsController.show)
router.put("/campaigns/:id", campaignsController.update)
router.delete("/campaigns/:id", campaignsController.delete)

router.get("/campaigns/:campaignId/leads", campaignLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads", campaignLeadsController.addLeads)
router.put("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.updateLeadStatus)
router.delete("/campaigns/:campaignId/leads/:leadId", campaignLeadsController.deleteLead)

router.get("/groups/:groupId/leads", groupLeadController.getLeads)
router.put("/groups/:groupId/leads", groupLeadController.addLead)
router.put("/groups/:groupId/leads/:leadId", groupLeadController.removeLead)

router.get("/test", (req,res, next) => {
    try{
       throw new HttpError(401, "nao autorizado")
        res.status(201).json({message: "Rota de teste funcionando!"})
    }catch(err){
        next(err)
    }
})




export { router }