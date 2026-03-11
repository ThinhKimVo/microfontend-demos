import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationType } from '@prisma/client';

interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

interface SendPushNotificationParams {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
  ) { }

  async findAll(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: { id, userId },
    });
  }

  async create(params: SendNotificationParams) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        data: params.data,
      },
    });

    // Send push notification
    await this.sendPushNotification({
      userId: params.userId,
      title: params.title,
      body: params.message,
      data: {
        notificationId: notification.id,
        type: params.type,
        ...(params.data ? this.stringifyData(params.data) : {}),
      },
    });

    return notification;
  }

  private stringifyData(data: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }

  async sendPushNotification(params: SendPushNotificationParams) {
    const deviceTokens = await this.prisma.deviceToken.findMany({
      where: { userId: params.userId },
    });

    if (deviceTokens.length === 0) {
      console.log(`[Push] No device tokens found for user ${params.userId}`);
      return;
    }

    const unreadCount = await this.getUnreadCount(params.userId);

    try {
      const messaging = this.firebaseService.getMessaging();

      // Build platform-specific messages for each device token
      // All tokens are FCM registration tokens from @react-native-firebase/messaging
      // iOS: FCM wraps APNs delivery automatically when APNs key is configured in Firebase
      const results = await Promise.allSettled(
        deviceTokens.map((dt) => {
          const isIos = dt.platform?.toLowerCase() === 'ios';

          console.log(`[Push] Sending to ${dt.platform} device (${dt.token.substring(0, 8)}...)`);

          const message: any = {
            token: dt.token,
            // Top-level notification ensures display on both platforms
            // and populates remoteMessage.notification in onMessage handler
            notification: {
              title: params.title,
              body: params.body,
            },
            data: {
              ...params.data,
              badgeCount: String(unreadCount),
            },
          };

          if (isIos) {
            // APNs-specific payload — takes precedence over top-level notification for iOS
            message.apns = {
              headers: {
                'apns-priority': '10',
                'apns-push-type': 'alert',
              },
              payload: {
                aps: {
                  badge: unreadCount,
                  sound: 'default',
                  'mutable-content': 1,
                  'content-available': 1,
                  'thread-id': params.data?.type || 'default',
                },
              },
            };
          } else {
            message.android = {
              priority: 'high' as const,
              notification: {
                sound: 'default',
                channelId: 'default',
                notificationCount: unreadCount,
              },
            };
          }

          return messaging.send(message);
        }),
      );

      const invalidTokens: string[] = [];
      let successCount = 0;
      let failCount = 0;

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          failCount++;
          const error = result.reason;
          const errorCode = error?.code || error?.errorInfo?.code || '';
          const errorMsg = error?.message || String(error);
          console.error(`[Push] Failed for ${deviceTokens[idx].platform} token (${deviceTokens[idx].token.substring(0, 8)}...):`, {
            code: errorCode,
            message: errorMsg,
          });

          // Remove tokens that are definitely invalid
          if (
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/invalid-argument'
          ) {
            invalidTokens.push(deviceTokens[idx].token);
          }
        }
      });

      if (invalidTokens.length > 0) {
        await this.prisma.deviceToken.deleteMany({
          where: { token: { in: invalidTokens } },
        });
        console.log(`[Push] Removed ${invalidTokens.length} invalid tokens`);
      }

      console.log(`[Push] Sent: ${successCount} success, ${failCount} failed`);
    } catch (error) {
      console.error('[Push] Error sending push notification:', error);
    }
  }

  // Device token management
  async registerDeviceToken(userId: string, token: string, platform: string) {
    // Upsert: update if exists, create if not
    return this.prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform, updatedAt: new Date() },
      create: { userId, token, platform },
    });
  }

  async removeDeviceToken(token: string) {
    return this.prisma.deviceToken.deleteMany({
      where: { token },
    });
  }

  async removeAllDeviceTokens(userId: string) {
    return this.prisma.deviceToken.deleteMany({
      where: { userId },
    });
  }

  // Helper methods for sending specific notification types
  async sendBookingConfirmation(userId: string, appointmentId: string, therapistName: string, dateTime: string) {
    return this.create({
      userId,
      type: 'BOOKING_CONFIRMATION',
      title: 'Booking Confirmed',
      message: `Your appointment with ${therapistName} on ${dateTime} has been confirmed.`,
      data: { appointmentId, screen: 'appointment-details' },
    });
  }

  async sendAppointmentReminder(userId: string, appointmentId: string, therapistName: string, minutesUntil: number) {
    return this.create({
      userId,
      type: 'APPOINTMENT_REMINDER',
      title: 'Appointment Reminder',
      message: `Your session with ${therapistName} starts in ${minutesUntil} minutes.`,
      data: { appointmentId, screen: 'appointment-details' },
    });
  }

  // ─── Session Reminder: Patient ─────────────────────────────────────────────

  async sendReminder24H(userId: string, appointmentId: string, therapistName: string, dateTime: string) {
    return this.create({
      userId,
      type: 'APPOINTMENT_REMINDER',
      title: '📅 Session Tomorrow',
      message: `Don't forget — your session with ${therapistName} is scheduled for ${dateTime}.`,
      data: { appointmentId, screen: 'appointment-details', reminderType: '24H' },
    });
  }

  async sendReminder1H(userId: string, appointmentId: string, therapistName: string) {
    return this.create({
      userId,
      type: 'APPOINTMENT_REMINDER',
      title: '⏰ Session in 1 Hour',
      message: `Your session with ${therapistName} starts in 1 hour. Get ready!`,
      data: { appointmentId, screen: 'appointment-details', reminderType: '1H' },
    });
  }

  async sendReminder15Min(userId: string, appointmentId: string, therapistName: string) {
    return this.create({
      userId,
      type: 'APPOINTMENT_REMINDER',
      title: '🚀 Session Starting Soon',
      message: `Your session with ${therapistName} starts in 15 minutes. Tap to join.`,
      data: { appointmentId, screen: 'join-session', reminderType: '15MIN' },
    });
  }

  // ─── Session Reminder: Therapist ───────────────────────────────────────────

  async sendTherapistReminder24H(therapistUserId: string, appointmentId: string, patientName: string, dateTime: string) {
    return this.create({
      userId: therapistUserId,
      type: 'APPOINTMENT_REMINDER',
      title: '📅 Session Tomorrow',
      message: `You have a session with ${patientName} scheduled for ${dateTime}.`,
      data: { appointmentId, screen: 'appointment-details', reminderType: '24H' },
    });
  }

  async sendTherapistReminder1H(therapistUserId: string, appointmentId: string, patientName: string) {
    return this.create({
      userId: therapistUserId,
      type: 'APPOINTMENT_REMINDER',
      title: '⏰ Session in 1 Hour',
      message: `Your session with ${patientName} starts in 1 hour.`,
      data: { appointmentId, screen: 'appointment-details', reminderType: '1H' },
    });
  }

  async sendTherapistReminder15Min(therapistUserId: string, appointmentId: string, patientName: string) {
    return this.create({
      userId: therapistUserId,
      type: 'APPOINTMENT_REMINDER',
      title: '🚀 Session Starting Soon',
      message: `Your session with ${patientName} starts in 15 minutes. Tap to join.`,
      data: { appointmentId, screen: 'join-session', reminderType: '15MIN' },
    });
  }

  async sendPaymentReceipt(userId: string, paymentId: string, amount: number) {
    const formattedAmount = (amount / 100).toFixed(2);
    return this.create({
      userId,
      type: 'PAYMENT_RECEIPT',
      title: 'Payment Received',
      message: `We've received your payment of $${formattedAmount}. Thank you!`,
      data: { paymentId, screen: 'payment-details' },
    });
  }

  async sendTherapistMessage(userId: string, therapistId: string, therapistName: string) {
    return this.create({
      userId,
      type: 'THERAPIST_MESSAGE',
      title: 'New Message',
      message: `${therapistName} sent you a message.`,
      data: { therapistId, screen: 'chat' },
    });
  }

  async sendSystemNotification(userId: string, title: string, message: string, data?: Record<string, any>) {
    return this.create({
      userId,
      type: 'SYSTEM',
      title,
      message,
      data,
    });
  }

  // Session feedback received - notify therapist
  async sendSessionFeedback(
    therapistUserId: string,
    appointmentId: string,
    rating: number,
    feedback?: string,
    isAnonymous?: boolean,
  ) {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const reviewerLabel = isAnonymous ? 'A patient (anonymous)' : 'A patient';
    const message = feedback
      ? `${reviewerLabel} rated your session ${stars} (${rating}/5): "${feedback}"`
      : `${reviewerLabel} rated your session ${stars} (${rating}/5).`;

    return this.create({
      userId: therapistUserId,
      type: 'SYSTEM',
      title: 'New Session Feedback',
      message,
      data: { appointmentId, screen: 'appointment-details' },
    });
  }

  // Chat message - push only, no DB record
  async sendChatMessage(recipientId: string, senderName: string, appointmentId: string) {
    console.log(`[Chat Push] Sending chat notification: recipient=${recipientId}, sender=${senderName}, appointment=${appointmentId}`);

    // Verify recipient has device tokens before sending
    const tokenCount = await this.prisma.deviceToken.count({
      where: { userId: recipientId },
    });
    console.log(`[Chat Push] Recipient ${recipientId} has ${tokenCount} device token(s)`);

    if (tokenCount === 0) {
      console.warn(`[Chat Push] No device tokens for recipient ${recipientId}, skipping push`);
      return;
    }

    try {
      await this.sendPushNotification({
        userId: recipientId,
        title: 'Healthcare - New Message',
        body: `${senderName} sent you a message.`,
        data: {
          type: 'THERAPIST_MESSAGE',
          screen: 'chat',
          appointmentId,
        },
      });
      console.log(`[Chat Push] Push notification sent successfully`);
    } catch (error) {
      console.error(`[Chat Push] Failed to send push notification:`, error);
    }
  }

  // Booking Request - notify therapist of new booking request
  async sendBookingRequest(therapistUserId: string, appointmentId: string, patientName: string, dateTime: string) {
    return this.create({
      userId: therapistUserId,
      type: 'SYSTEM',
      title: 'New Booking Request',
      message: `${patientName} has requested an appointment on ${dateTime}. Please review and respond.`,
      data: { appointmentId, screen: 'appointment-details' },
    });
  }

  // Booking Declined - notify patient that therapist declined
  async sendBookingDeclined(userId: string, appointmentId: string, therapistName: string, reason?: string) {
    const message = reason
      ? `${therapistName} was unable to accept your booking request. Reason: ${reason}`
      : `${therapistName} was unable to accept your booking request. Please try another time slot.`;

    return this.create({
      userId,
      type: 'SYSTEM',
      title: 'Booking Not Available',
      message,
      data: { appointmentId, screen: 'appointment-details' },
    });
  }

  // Appointment Cancelled - notify the other party
  async sendAppointmentCancelled(
    userId: string,
    appointmentId: string,
    cancelledByName: string,
    dateTime: string,
    reason?: string
  ) {
    const message = reason
      ? `Your appointment on ${dateTime} has been cancelled by ${cancelledByName}. Reason: ${reason}`
      : `Your appointment on ${dateTime} has been cancelled by ${cancelledByName}.`;

    return this.create({
      userId,
      type: 'SYSTEM',
      title: 'Appointment Cancelled',
      message,
      data: { appointmentId, screen: 'appointment-details' },
    });
  }
}
