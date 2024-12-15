import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategorDto: CreateCategoryDto, id: number) {
    const isExist = await this.categoryRepository.findBy({
      user: { id },
      title: createCategorDto.title,
    });
    if (isExist.length)
      throw new BadRequestException('this category already exist');
    const newCategory = { title: createCategorDto.title, user: { id } };
    return await this.categoryRepository.save(newCategory);
  }
  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: { user: { id } },
      relations: {
        transactions: true,
      },
    });
  }

  async findOne(id: number) {
    const isExist = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        user: true,
        transactions: true,
      },
    });
    if (!isExist) throw new BadRequestException('category not found');
    return isExist;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const isExist = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new BadRequestException('category not found');
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    const isExist = this.categoryRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new BadRequestException('category not found');
    return this.categoryRepository.delete({
      id,
    });
  }
}
