import { z } from 'zod'

export type CommentStatus = 'open' | 'resolved' | 'in_progress'
export type WorkflowStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'executed'
export type ApprovalLevel = 'manager' | 'director' | 'executive' | 'compliance_officer'

export interface Comment {
  id: string
  resourceType: string
  resourceId: string
  userId: string
  userName: string
  content: string
  status: CommentStatus
  resolvedAt?: Date
  replies?: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface ApprovalWorkflow {
  id: string
  resourceId: string
  resourceType: string
  status: WorkflowStatus
  createdBy: string
  createdAt: Date
  approvalChain: ApprovalStep[]
  rejectionReason?: string
}

export interface ApprovalStep {
  level: ApprovalLevel
  assignee: string
  status: 'pending' | 'approved' | 'rejected'
  comment?: string
  actionAt?: Date
}

export interface ActivityFeed {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  details: Record<string, any>
  timestamp: Date
}

export interface TeamWorkspace {
  id: string
  name: string
  description?: string
  members: TeamMember[]
  createdAt: Date
}

export interface TeamMember {
  userId: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'member' | 'viewer'
  joinedAt: Date
}

const CommentSchema = z.object({
  resourceType: z.string(),
  resourceId: z.string(),
  content: z.string().min(1).max(2000),
})

export type CommentInput = z.infer<typeof CommentSchema>

export class CommentManager {
  private comments: Map<string, Comment> = new Map()

  addComment(input: CommentInput, userId: string, userName: string): Comment {
    const id = `comment-${Date.now()}`
    const comment: Comment = {
      id,
      ...input,
      userId,
      userName,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
    }

    this.comments.set(id, comment)
    return comment
  }

  replyToComment(commentId: string, input: CommentInput, userId: string, userName: string): Comment | null {
    const parent = this.comments.get(commentId)
    if (!parent) return null

    const reply: Comment = {
      id: `comment-${Date.now()}`,
      ...input,
      userId,
      userName,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (!parent.replies) parent.replies = []
    parent.replies.push(reply)
    return reply
  }

  resolveComment(commentId: string): boolean {
    const comment = this.comments.get(commentId)
    if (comment) {
      comment.status = 'resolved'
      comment.resolvedAt = new Date()
      return true
    }
    return false
  }

  getComments(resourceType: string, resourceId: string): Comment[] {
    return Array.from(this.comments.values()).filter(
      (c) => c.resourceType === resourceType && c.resourceId === resourceId
    )
  }
}

export class ApprovalWorkflowEngine {
  private workflows: Map<string, ApprovalWorkflow> = new Map()

  createWorkflow(resourceId: string, resourceType: string, createdBy: string, approvalLevels: ApprovalLevel[]): ApprovalWorkflow {
    const id = `workflow-${Date.now()}`
    const workflow: ApprovalWorkflow = {
      id,
      resourceId,
      resourceType,
      createdBy,
      status: 'draft',
      createdAt: new Date(),
      approvalChain: approvalLevels.map((level) => ({
        level,
        assignee: '', // Would be populated from org structure
        status: 'pending',
      })),
    }

    this.workflows.set(id, workflow)
    return workflow
  }

  submitForApproval(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId)
    if (workflow && workflow.status === 'draft') {
      workflow.status = 'pending_approval'
      return true
    }
    return false
  }

  approveStep(workflowId: string, stepIndex: number, userId: string, comment?: string): boolean {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) return false

    const step = workflow.approvalChain[stepIndex]
    if (!step) return false

    step.status = 'approved'
    step.actionAt = new Date()
    if (comment) step.comment = comment

    const allApproved = workflow.approvalChain.every((s) => s.status === 'approved')
    if (allApproved) {
      workflow.status = 'approved'
    }

    return true
  }

  rejectWorkflow(workflowId: string, reason: string): boolean {
    const workflow = this.workflows.get(workflowId)
    if (workflow) {
      workflow.status = 'rejected'
      workflow.rejectionReason = reason
      return true
    }
    return false
  }

  getWorkflow(workflowId: string): ApprovalWorkflow | null {
    return this.workflows.get(workflowId) || null
  }
}

export class ActivityFeedManager {
  private feed: ActivityFeed[] = []

  logActivity(userId: string, action: string, resourceType: string, resourceId: string, details?: Record<string, any>): ActivityFeed {
    const activity: ActivityFeed = {
      id: `activity-${Date.now()}`,
      userId,
      action,
      resourceType,
      resourceId,
      details: details || {},
      timestamp: new Date(),
    }

    this.feed.unshift(activity) // Add to beginning
    return activity
  }

  getActivityFeed(limit: number = 50): ActivityFeed[] {
    return this.feed.slice(0, limit)
  }

  getActivityByResource(resourceType: string, resourceId: string): ActivityFeed[] {
    return this.feed.filter((a) => a.resourceType === resourceType && a.resourceId === resourceId)
  }

  getActivityByUser(userId: string, limit: number = 20): ActivityFeed[] {
    return this.feed.filter((a) => a.userId === userId).slice(0, limit)
  }
}

export class TeamWorkspaceManager {
  private workspaces: Map<string, TeamWorkspace> = new Map()

  createWorkspace(name: string, description?: string): TeamWorkspace {
    const id = `ws-${Date.now()}`
    const workspace: TeamWorkspace = {
      id,
      name,
      description,
      members: [],
      createdAt: new Date(),
    }

    this.workspaces.set(id, workspace)
    return workspace
  }

  addMember(workspaceId: string, userId: string, name: string, email: string, role: 'admin' | 'manager' | 'member' | 'viewer' = 'member'): boolean {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) return false

    workspace.members.push({
      userId,
      name,
      email,
      role,
      joinedAt: new Date(),
    })

    return true
  }

  removeMember(workspaceId: string, userId: string): boolean {
    const workspace = this.workspaces.get(workspaceId)
    if (!workspace) return false

    workspace.members = workspace.members.filter((m) => m.userId !== userId)
    return true
  }

  getWorkspace(workspaceId: string): TeamWorkspace | null {
    return this.workspaces.get(workspaceId) || null
  }
}

export const commentManager = new CommentManager()
export const approvalWorkflowEngine = new ApprovalWorkflowEngine()
export const activityFeedManager = new ActivityFeedManager()
export const teamWorkspaceManager = new TeamWorkspaceManager()
