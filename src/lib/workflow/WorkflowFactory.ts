import type { Workflow } from '@/types/core';

export class WorkflowFactory {
    static createWorkflow(params: Partial<Workflow>): Workflow {
        return {
            id: params.id || crypto.randomUUID(),
            name: params.name || '',
            version: params.version || 1,
            status: params.status || 'draft',
            createdAt: params.createdAt || new Date(),
            updatedAt: params.updatedAt || new Date(),
            triggers: params.triggers || [],
            steps: params.steps || []
        };
    }
} 