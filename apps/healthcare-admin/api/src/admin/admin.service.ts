import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async getDashboard() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalTherapists,
      pendingVerifications,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
      revenueToday,
      revenueWeek,
      revenueMonth,
      recentUsers,
      recentBookings,
      pendingTherapists,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.therapist.count({ where: { verificationStatus: 'APPROVED' } }),
      this.prisma.therapist.count({ where: { verificationStatus: 'PENDING_REVIEW' } }),
      this.prisma.appointment.count(),
      this.prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.appointment.count({ where: { status: 'CANCELLED' } }),
      this.prisma.appointment.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } }),
      this.prisma.payment.aggregate({ where: { status: 'SUCCESS', createdAt: { gte: startOfDay } }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { status: 'SUCCESS', createdAt: { gte: startOfWeek } }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { status: 'SUCCESS', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
      this.prisma.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
      }),
      this.prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { firstName: true, lastName: true } },
          therapist: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
      }),
      this.prisma.therapist.findMany({
        where: { verificationStatus: 'PENDING_REVIEW' },
        take: 5,
        include: {
          user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
          specializations: { include: { specialization: true } },
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalTherapists,
        pendingVerifications,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        pendingAppointments,
      },
      revenue: {
        today: revenueToday._sum.amount || 0,
        thisWeek: revenueWeek._sum.amount || 0,
        thisMonth: revenueMonth._sum.amount || 0,
      },
      recentUsers,
      recentBookings,
      pendingTherapists,
    };
  }

  async getSettings(): Promise<Record<string, string>> {
    const settings = await this.prisma.systemSetting.findMany();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  }

  async updateSettings(data: Record<string, string>) {
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        this.prisma.systemSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );
    return this.getSettings();
  }

  async getSupportTickets(options: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 20, search, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateSupportTicket(id: string, data: { status?: string; assignedTo?: string }) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Support ticket not found');
    return this.prisma.supportTicket.update({
      where: { id },
      data: {
        ...data,
        resolvedAt: data.status === 'RESOLVED' ? new Date() : undefined,
      },
    });
  }

  // ─── Push Notifications ─────────────────────────────────────────────

  async getPushNotifications(options: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = options;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.adminPushNotification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.adminPushNotification.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createPushNotification(
    data: {
      title: string;
      message: string;
      imageUrl?: string;
      deepLink?: string;
      targetAudience: string;
      targetUserId?: string;
      scheduledAt?: string;
    },
    adminId: string,
  ) {
    const targetCount = await this.getTargetCount(data.targetAudience, data.targetUserId);
    const status = data.scheduledAt ? 'scheduled' : 'draft';

    return this.prisma.adminPushNotification.create({
      data: {
        title: data.title,
        message: data.message,
        imageUrl: data.imageUrl || null,
        deepLink: data.deepLink || null,
        targetAudience: data.targetAudience,
        targetUserId: data.targetUserId || null,
        targetCount,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        status,
        createdBy: adminId,
      },
    });
  }

  async sendPushNotification(id: string) {
    const notification = await this.prisma.adminPushNotification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Push notification not found');

    await this.prisma.adminPushNotification.update({
      where: { id },
      data: { status: 'sending' },
    });

    try {
      const users = await this.getTargetUsers(notification.targetAudience, notification.targetUserId ?? undefined);
      let deliveredCount = 0;
      let failedCount = 0;

      for (const user of users) {
        try {
          await this.notificationsService.create({
            userId: user.id,
            type: 'SYSTEM',
            title: notification.title,
            message: notification.message,
            data: notification.deepLink ? { screen: notification.deepLink } : undefined,
          });
          deliveredCount++;
        } catch {
          failedCount++;
        }
      }

      await this.prisma.adminPushNotification.update({
        where: { id },
        data: {
          status: 'sent',
          sentAt: new Date(),
          deliveredCount,
          failedCount,
        },
      });

      return { deliveredCount, failedCount, total: users.length };
    } catch (error) {
      await this.prisma.adminPushNotification.update({
        where: { id },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  // ─── Reviews / Feedback ──────────────────────────────────────────────

  async getReviews(options: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: number;
    isFlagged?: boolean;
    therapistId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { page = 1, limit = 20, search, rating, isFlagged, therapistId, dateFrom, dateTo } = options;
    const where: any = {};

    if (rating) where.rating = rating;
    if (isFlagged !== undefined) where.isFlagged = isFlagged;
    if (therapistId) where.therapistId = therapistId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo + 'T23:59:59');
    }
    if (search) {
      where.OR = [
        { feedback: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total, stats] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          therapist: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
          appointment: { select: { id: true, scheduledAt: true } },
        },
      }),
      this.prisma.review.count({ where }),
      this.prisma.review.aggregate({
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    const fiveStarCount = await this.prisma.review.count({ where: { rating: 5 } });
    const flaggedCount = await this.prisma.review.count({ where: { isFlagged: true } });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      stats: {
        total: stats._count,
        avgRating: stats._avg.rating || 0,
        fiveStarCount,
        flaggedCount,
      },
    };
  }

  async flagReview(id: string, flagReason: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.update({
      where: { id },
      data: { isFlagged: true, isHidden: true, flagReason },
    });
  }

  async unflagReview(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { isFlagged: false, flagReason: null },
    });
  }

  async toggleHideReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.update({
      where: { id },
      data: { isHidden: !review.isHidden },
    });
  }

  private async getTargetCount(audience: string, targetUserId?: string): Promise<number> {
    switch (audience) {
      case 'all_users':
        return this.prisma.user.count({ where: { role: 'USER' } });
      case 'all_therapists':
        return this.prisma.user.count({ where: { role: 'THERAPIST' } });
      case 'all':
        return this.prisma.user.count({ where: { role: { in: ['USER', 'THERAPIST'] } } });
      case 'specific':
        return targetUserId ? 1 : 0;
      default:
        return 0;
    }
  }

  private async getTargetUsers(audience: string, targetUserId?: string) {
    switch (audience) {
      case 'all_users':
        return this.prisma.user.findMany({ where: { role: 'USER' }, select: { id: true } });
      case 'all_therapists':
        return this.prisma.user.findMany({ where: { role: 'THERAPIST' }, select: { id: true } });
      case 'all':
        return this.prisma.user.findMany({ where: { role: { in: ['USER', 'THERAPIST'] } }, select: { id: true } });
      case 'specific':
        if (!targetUserId) return [];
        const user = await this.prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } });
        return user ? [user] : [];
      default:
        return [];
    }
  }
}
