import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  categories: any[] = [];
  category: any = {};
  newCategory = { name: '' };
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  addCategory() {
    this.categoryService.createCategory(this.category).subscribe((data) => {
      this.categories.push(data);
      this.category = {}; // reset form
      this.newCategory = { name: '' };
    });
  }

  getAllCategories() {
  this.categoryService.getCategories().subscribe((data) => {
    this.categories = data.data.categories;
  });
}

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.categories = this.categories.filter((c) => c._id !== categoryId);
    });
  }
}
