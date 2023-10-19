import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiOperation({ summary: 'Creates a new subscription' })
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @ApiOperation({ summary: 'Finds all subscriptions' })
  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @ApiOperation({ summary: 'Returns categories of a given subscription' })
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.subscriptionsService.findOne(email);
  }

  @ApiOperation({ summary: 'Updates a subscription' })
  @Patch(':email')
  update(
    @Param('email') email: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(email, updateSubscriptionDto);
  }

  @ApiOperation({ summary: 'Deletes a subscription' })
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.subscriptionsService.remove(email);
  }
}
