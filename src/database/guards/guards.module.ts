import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Guard, GuardSchema } from '../schemas';
import { GuardsService } from './guards.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Guard.name,
        schema: GuardSchema,
      },
    ]),
  ],
  providers: [GuardsService],
  exports: [GuardsService],
})
export class GuardsModule {}
