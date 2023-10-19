import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesRepository.insert(createCategoryDto);
    } catch {
      return await this.categoriesRepository.restore(createCategoryDto);
    }
  }

  async findAll() {
    return (await this.categoriesRepository.find()).map((c) => c.name);
  }

  async remove(name: string) {
    return this.categoriesRepository.softDelete(name);
  }
}
