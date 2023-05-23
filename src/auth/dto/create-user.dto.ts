import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  readonly telegram_id: number;

  @IsNotEmpty()
  readonly name: string;
}
