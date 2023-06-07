import { Module } from '@nestjs/common';
import { GetcourseController } from './getcourse.controller';
import { GuardsModule } from 'src/database';

@Module({
  imports: [GuardsModule],
  controllers: [GetcourseController],
})
export class GetcourseModule {}
