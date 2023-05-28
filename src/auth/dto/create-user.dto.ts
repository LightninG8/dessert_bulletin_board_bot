import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  readonly telegram_id: number;

  @IsNotEmpty()
  readonly name: string;

  type: 'seller' | 'consumer';

  photo: string | null;

  city: string;

  about: string;

  contacts: string;

  location?: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    streetName: string;
    streetNumber: string;
    countryCode: string;
    neighbourhood: string;
    provider: string;
  } | null;
}
