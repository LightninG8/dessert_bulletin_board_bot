import { IsNotEmpty } from 'class-validator';
import { ILocation } from './create-user.dto';

export class AddAnnouncementDto {
  @IsNotEmpty()
  readonly title: string;

  description: string;

  photo: string | null;

  price: string;

  city: string;

  contacts: string;

  location?: ILocation | null;

  authorId: number;
}
