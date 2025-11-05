import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { USER_EVENTS } from '@app/events';

@Controller()
export class UserEventsController {
  private readonly logger = new Logger(UserEventsController.name);

  @EventPattern(USER_EVENTS.REGISTERED)
  async handleUserRegistered(@Payload() data: any) {
    this.logger.log('📩 Received user.registered event');
    this.logger.log(JSON.stringify(data, null, 2));

    // TODO: Create client portal access if role is 'klien'
    if (data.data.role === 'klien') {
      this.logger.log(`Creating portal access for client: ${data.data.email}`);
      // Implementation will be in Phase 7
    }
  }

  @EventPattern(USER_EVENTS.LOGGED_IN)
  async handleUserLoggedIn(@Payload() data: any) {
    this.logger.log('📩 Received user.logged_in event');
    this.logger.log(`User ${data.data.email} logged in`);

    // TODO: Log activity
  }

  @EventPattern(USER_EVENTS.UPDATED)
  async handleUserUpdated(@Payload() data: any) {
    this.logger.log('📩 Received user.updated event');
    this.logger.log(`User ${data.data.email} updated profile`);

    // TODO: Update related records if needed
  }

  @EventPattern(USER_EVENTS.DELETED)
  async handleUserDeleted(@Payload() data: any) {
    this.logger.log('📩 Received user.deleted event');
    this.logger.log(`User ${data.data.email} deleted`);

    // TODO: Clean up related data
  }

  @EventPattern(USER_EVENTS.PASSWORD_CHANGED)
  async handlePasswordChanged(@Payload() data: any) {
    this.logger.log('📩 Received user.password_changed event');
    this.logger.log(`User ${data.data.email} changed password`);

    // TODO: Send notification email
  }
}