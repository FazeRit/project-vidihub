import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateChatDto {
  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Назва чату не може бути порожньою' })
  @MaxLength(100, { message: 'Назва чату занадто довга (макс. 100 символів)' })
  title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Опис занадто довгий (макс. 500 символів)' })
  description?: string;
}
