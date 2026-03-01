import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class SendMessageDto {
  @IsUUID('4', { message: 'ID чату має бути валідним UUID v4' })
  chatId: string;

  @IsString({ message: 'Повідомлення має бути рядком' })
  @IsNotEmpty({ message: 'Повідомлення не може бути порожнім' })
  @MinLength(1, { message: 'Повідомлення занадто коротке' })
  @MaxLength(2000, {
    message: 'Повідомлення занадто довге (макс. 2000 символів)',
  })
  content: string;

  @IsString()
  @IsOptional()
  tempId?: string;
}
