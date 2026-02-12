"use server"

import { prisma } from "@/lib/prisma"

export type NotificationType = "task_assigned" | "update_critical" | "task_due_soon"

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) {
  return prisma.notification.create({
    data: { userId, type, title, message, link },
  })
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  })
}
