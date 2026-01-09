/**
 * GuaranteesService - Serviço de Garantias
 * 
 * Gerencia garantias de recuperação (Risco Zero).
 * Baseado no useGuaranteeStore.
 */

import { getAdapter } from '../adapters'

export class GuaranteesService {
  constructor() {
    this.adapter = null
    this.resource = 'guarantees'
  }

  async ensureAdapter() {
    if (!this.adapter) {
      this.adapter = await getAdapter()
    }
    return this.adapter
  }

  /**
   * Busca garantia ativa do usuário
   */
  async getActiveGuarantee() {
    const adapter = await this.ensureAdapter()
    
    const guarantees = await adapter.findMany(this.resource, {
      filters: { status: 'active' },
      order: { column: 'created_at', ascending: false },
      limit: 1,
      select: `
        *,
        subscription:user_subscriptions(
          id,
          plan_name,
          monthly_fee,
          status
        )
      `
    })

    return guarantees[0] || null
  }

  /**
   * Lista todas as garantias
   */
  async listGuarantees(options = {}) {
    const adapter = await this.ensureAdapter()
    
    const { status = null } = options

    const filters = {}
    if (status) filters.status = status

    return await adapter.findMany(this.resource, {
      filters,
      order: { column: 'created_at', ascending: false }
    })
  }

  /**
   * Atualiza valor recuperado
   */
  async updateRecoveredAmount(guaranteeId, newAmount) {
    const adapter = await this.ensureAdapter()
    
    return await adapter.update(this.resource, guaranteeId, {
      current_recovered_amount: newAmount,
      updated_at: new Date().toISOString()
    })
  }

  /**
   * Calcula progresso da garantia
   */
  calculateProgress(guarantee) {
    if (!guarantee) return null

    const goal = parseFloat(guarantee.goal_amount) || 0
    const recovered = parseFloat(guarantee.current_recovered_amount) || 0

    const percentage = goal > 0 ? (recovered / goal) * 100 : 0
    const remaining = Math.max(0, goal - recovered)

    const now = new Date()
    const endDate = new Date(guarantee.end_date)
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)))

    return {
      goalAmount: goal,
      recoveredAmount: recovered,
      remainingAmount: remaining,
      percentage: parseFloat(percentage.toFixed(2)),
      daysRemaining,
      isExpired: now > endDate,
      isAchieved: recovered >= goal
    }
  }

  /**
   * Retorna status da garantia
   */
  getGuaranteeStatus(guarantee) {
    const progress = this.calculateProgress(guarantee)

    if (!progress) return null

    const { percentage, daysRemaining, isExpired, isAchieved } = progress

    if (isAchieved) {
      return { level: 'success', message: 'Meta atingida! 🎉' }
    }

    if (isExpired) {
      return { level: 'expired', message: 'Garantia expirada' }
    }

    if (daysRemaining <= 15 && percentage < 50) {
      return {
        level: 'critical',
        message: `Atenção! Apenas ${daysRemaining} dias e ${percentage.toFixed(1)}% da meta`
      }
    }

    if (daysRemaining <= 30 && percentage < 70) {
      return {
        level: 'warning',
        message: `${daysRemaining} dias para atingir ${(100 - percentage).toFixed(1)}% da meta`
      }
    }

    return { level: 'ok', message: 'No caminho certo!' }
  }
}

export const guaranteesService = new GuaranteesService()
export default guaranteesService
