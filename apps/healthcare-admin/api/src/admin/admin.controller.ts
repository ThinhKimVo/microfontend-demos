import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, SetMetadata, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, ROLES_KEY } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata(ROLES_KEY, [UserRole.ADMIN])
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get all system settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Post('settings')
  @ApiOperation({ summary: 'Upsert system settings' })
  async updateSettings(@Body() body: Record<string, string>) {
    return this.adminService.updateSettings(body);
  }

  @Get('support')
  @ApiOperation({ summary: 'List support tickets' })
  async getSupportTickets(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getSupportTickets({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      status,
    });
  }

  @Patch('support/:id')
  @ApiOperation({ summary: 'Update support ticket' })
  async updateSupportTicket(
    @Param('id') id: string,
    @Body() body: { status?: string; assignedTo?: string },
  ) {
    return this.adminService.updateSupportTicket(id, body);
  }

  // ─── Push Notifications ─────────────────────────────────────────────

  @Get('push-notifications')
  @ApiOperation({ summary: 'List push notifications' })
  async getPushNotifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getPushNotifications({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
    });
  }

  @Post('push-notifications')
  @ApiOperation({ summary: 'Create a push notification' })
  async createPushNotification(
    @Request() req: any,
    @Body() body: {
      title: string;
      message: string;
      imageUrl?: string;
      deepLink?: string;
      targetAudience: string;
      targetUserId?: string;
      scheduledAt?: string;
    },
  ) {
    return this.adminService.createPushNotification(body, req.user.id);
  }

  @Post('push-notifications/:id/send')
  @ApiOperation({ summary: 'Send a push notification' })
  async sendPushNotification(@Param('id') id: string) {
    return this.adminService.sendPushNotification(id);
  }

  // ─── Reviews / Feedback ─────────────────────────────────────────────

  @Get('reviews')
  @ApiOperation({ summary: 'List all reviews with filters' })
  async getReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('rating') rating?: string,
    @Query('isFlagged') isFlagged?: string,
    @Query('therapistId') therapistId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.adminService.getReviews({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      rating: rating ? parseInt(rating) : undefined,
      isFlagged: isFlagged !== undefined ? isFlagged === 'true' : undefined,
      therapistId,
      dateFrom,
      dateTo,
    });
  }

  @Patch('reviews/:id/flag')
  @ApiOperation({ summary: 'Flag a review' })
  async flagReview(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.flagReview(id, body.reason);
  }

  @Patch('reviews/:id/unflag')
  @ApiOperation({ summary: 'Unflag a review' })
  async unflagReview(@Param('id') id: string) {
    return this.adminService.unflagReview(id);
  }

  @Patch('reviews/:id/toggle-hide')
  @ApiOperation({ summary: 'Toggle review visibility' })
  async toggleHideReview(@Param('id') id: string) {
    return this.adminService.toggleHideReview(id);
  }
}
