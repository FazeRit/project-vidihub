import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

@Expose()
export class CreateChatDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва чату не може бути порожньою' })
  @MaxLength(100, { message: 'Назва чату занадто довга (макс. 100 символів)' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Опис занадто довгий (макс. 500 символів)' })
  description?: string;
}
