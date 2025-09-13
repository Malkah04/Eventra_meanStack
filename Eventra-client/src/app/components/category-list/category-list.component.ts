import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/models/category.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res;
    });
  }
editCategory(id: string) {
  this.router.navigate(['/categories/edit', id]);
}

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  goToEdit(id: string) {
    this.router.navigate(['/admin/categories/edit', id]);
  }
}