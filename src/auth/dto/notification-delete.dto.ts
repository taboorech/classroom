import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NotificationType } from "../notification-type.enum";

export class NotificationDeleteDto {
  @IsNotEmpty()
  @IsString()
  notificationId: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;
}