import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsRepository.save({
      ...createSubscriptionDto,
      categories: createSubscriptionDto.categories.map((c) => ({
        name: c,
      })),
    });
  }

  async findAll() {
    return this.subscriptionsRepository.find({
      relations: { categories: true },
    });
  }

  async findRecipientsByCategories(
    categories: Category[],
    ignoreMails: string[],
  ) {
    return (
      await this.subscriptionsRepository
        .createQueryBuilder('s')
        .where('s.email NOT IN (:...p)', { p: ignoreMails })
        .innerJoinAndSelect('s.categories', 'c', 'c.name IN (:...p)', {
          p: categories.map((c) => c.name),
        })
        .getMany()
    ).map((s) => s.email);
  }

  async findOne(email: string) {
    return (
      await this.subscriptionsRepository.findOne({
        where: { email },
        relations: { categories: true },
      })
    )?.categories.map((c) => c.name);
  }

  async update(email: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsRepository.save({
      email,
      categories: updateSubscriptionDto.categories.map((c) => ({ name: c })),
    });
  }

  async remove(email: string) {
    return this.subscriptionsRepository.delete(email);
  }
}
