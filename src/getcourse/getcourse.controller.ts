import { Controller, Post, Query } from '@nestjs/common';
import { GuardsService } from 'src/database';

@Controller('getcourse')
export class GetcourseController {
  constructor(private guardsService: GuardsService) {}

  @Post('/add')
  async addUserIdToSellerGuard(@Query() params: any): Promise<boolean> {
    await this.guardsService.addValueToGuardArray('sellers', +params.id);

    return true;
  }

  @Post('/remove')
  async removeUserIdFromSellerGuard(@Query() params: any): Promise<boolean> {
    await this.guardsService.removeValueFromGuardArray('sellers', +params.id);

    return true;
  }
}
