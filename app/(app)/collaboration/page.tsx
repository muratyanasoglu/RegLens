'use client'

import { TranslatedPageHeader } from "@/components/translated-page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, CheckCircle2, Clock, Users, Activity } from 'lucide-react'

export default function CollaborationPage() {
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      avatar: 'JD',
      action: 'approved',
      resource: 'Task: GDPR Data Processing Update',
      time: '2 hours ago',
    },
    {
      id: 2,
      user: 'Jane Smith',
      avatar: 'JS',
      action: 'commented on',
      resource: 'Mapping: ISO 27001 AC.2.1',
      time: '4 hours ago',
    },
    {
      id: 3,
      user: 'Bob Wilson',
      avatar: 'BW',
      action: 'created',
      resource: 'Task: Update Encryption Policy',
      time: '1 day ago',
    },
  ]

  const approvals = [
    {
      id: 1,
      title: 'NIST CSF Control Implementation',
      status: 'pending',
      requester: 'Alice Johnson',
      steps: [
        { role: 'Compliance Manager', status: 'pending' },
        { role: 'Director', status: 'pending' },
        { role: 'Executive', status: 'pending' },
      ],
    },
    {
      id: 2,
      title: 'Security Policy Update Q1 2024',
      status: 'in_review',
      requester: 'Bob Wilson',
      steps: [
        { role: 'Compliance Manager', status: 'approved' },
        { role: 'Director', status: 'pending' },
        { role: 'Executive', status: 'pending' },
      ],
    },
    {
      id: 3,
      title: 'GDPR Data Residency Configuration',
      status: 'approved',
      requester: 'Jane Smith',
      steps: [
        { role: 'Compliance Manager', status: 'approved' },
        { role: 'Director', status: 'approved' },
        { role: 'Executive', status: 'approved' },
      ],
    },
  ]

  const teams = [
    {
      name: 'Compliance Team',
      members: 5,
      role: 'admin',
      description: 'Central compliance and regulatory team',
    },
    {
      name: 'Security Operations',
      members: 8,
      role: 'manager',
      description: 'Security and incident response team',
    },
    {
      name: 'Risk Management',
      members: 3,
      role: 'member',
      description: 'Enterprise risk assessment and mitigation',
    },
  ]

  return (
    <>
      <TranslatedPageHeader
        titleKey="collaboration.title"
        descriptionKey="collaboration.description"
      />

      <div className="content-max py-6 lg:py-8">
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="approvals">Approval Workflows</TabsTrigger>
          <TabsTrigger value="comments">Comments & Threads</TabsTrigger>
          <TabsTrigger value="teams">Team Workspaces</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Organization-wide activity feed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback>{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        <span>{activity.user}</span>
                        <span className="text-muted-foreground mx-1">{activity.action}</span>
                        <span className="font-semibold">{activity.resource}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Approval Workflows</CardTitle>
              <CardDescription>Pending and completed approvals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approvals.map((approval) => (
                <div key={approval.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{approval.title}</h3>
                      <p className="text-sm text-muted-foreground">Requested by {approval.requester}</p>
                    </div>
                    <Badge
                      variant={
                        approval.status === 'approved'
                          ? 'success'
                          : approval.status === 'pending'
                            ? 'destructive'
                            : 'warning'
                      }
                    >
                      {approval.status === 'approved' ? 'Approved' : approval.status === 'pending' ? 'Pending' : 'In Review'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {approval.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            step.status === 'approved'
                              ? 'bg-success text-success-foreground'
                              : step.status === 'pending'
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-warning text-warning-foreground'
                          }`}
                        >
                          {step.status === 'approved' ? '✓' : step.status === 'pending' ? '○' : ''}
                        </div>
                        <span>{step.role}</span>
                        <span className="text-xs text-muted-foreground ml-auto capitalize">
                          {step.status === 'approved' ? 'Approved' : step.status === 'pending' ? 'Awaiting' : 'In Progress'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {approval.status !== 'approved' && (
                      <>
                        <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Comments & Discussion Threads</CardTitle>
              <CardDescription>Active discussions on resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">John Doe</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This control needs additional documentation for the upcoming SOC 2 audit. We should gather evidence by next week.
                    </p>
                    <div className="flex gap-2 mt-2 text-xs">
                      <button className="text-primary">Reply</button>
                      <button className="text-muted-foreground">Resolve</button>
                      <span className="text-muted-foreground">2 replies</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 ml-8">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Jane Smith</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      I can prepare the documentation. I'll compile the evidence by Wednesday.
                    </p>
                    <div className="flex gap-2 mt-2 text-xs">
                      <button className="text-primary">Reply</button>
                      <span className="text-muted-foreground">1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
              <Button>Post Comment</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="section-title-accent text-lg font-semibold">Team Workspaces</h2>
            <Button>Create Workspace</Button>
          </div>

          <div className="space-y-3">
            {teams.map((team) => (
              <Card key={team.name} className="card-premium card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{team.name}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {team.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        {team.members} members
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
