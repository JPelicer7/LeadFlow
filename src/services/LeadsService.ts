import { availableParallelism } from "node:os";
import { HttpError } from "../errors/HttpError";
import { CreateLeadAttributes, LeadsRepository, LeadStatus,  LeadWhereParams } from "../repositories/LeadsRepository";

interface GetLeadsWithPaginationParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: LeadStatus;
  sortBy?: "name" | "status" | "createdAt";
  order?: "asc" | "desc";
}




export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
    const { name, status, page= 1, pageSize= 10, sortBy, order } = params;
    const limit = pageSize;
    const offset = (page - 1)* limit;

    const whereClause: LeadWhereParams = {}; // foi mudado aqui tbm da parte da interface

    if (name) whereClause.name = { like: name, mode: "insensitive" }; // filtrar por nome
    if (status && status.trim() !== "") {
      whereClause.status = status as any;
    }

    const leads = await this.leadsRepository.find({
      where: whereClause,
      sortBy,
      order,
      limit,
      offset,
    });
    const totalLeads = await this.leadsRepository.count(whereClause);

    return {
      data: leads,
      meta: {
        page,
        pageSize,
        totalLeads,
        totalPages: Math.ceil(totalLeads / pageSize),
      },
    };
  }

   async createLead(params: CreateLeadAttributes) {
		if (!params.status) params.status = "New"
		const newLead = await this.leadsRepository.create(params)
		return newLead
	}

    async getLeadById(id: number) {
        const lead = await this.leadsRepository.findById(id)
        if (!lead) throw new HttpError(404, "lead não encontrado")
        return lead
    }

    async updateLead(leadId: number, params: Partial<CreateLeadAttributes>) {
        const lead = await this.leadsRepository.findById(leadId)
        if(!lead) throw new HttpError(404, "Lead not found")
        
        if(lead.status === "New" && params.status !== "Contacted"){
            throw new HttpError(400,"O lead deve ter seus status Contacted antes de receber outro")
        }

        if (params.status === "Archived") {
            const now = new Date() // cria a data atual
            const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime()) // diminui a data atual da ultima data de atualizaçao
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // e compara se da 6 meses
            if (diffDays < 180) throw new HttpError(400, "um lead só pode ser arquivado após 6 meses de inatividade")
        }

        const updatedLead = await this.leadsRepository.updateById(leadId, params)
        if(!updatedLead) throw new HttpError(404, "lead não encontrado")
        return updatedLead
    }

    async deleteLead(leadId: number) {
        const deletedLead = await this.leadsRepository.deleteById(leadId)
        if(!deletedLead) throw new HttpError(404, "lead não encontrado")

        return deletedLead
    }

}
