import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // GET /categories - publik, dipake buat dropdown di modal request
  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }
}
