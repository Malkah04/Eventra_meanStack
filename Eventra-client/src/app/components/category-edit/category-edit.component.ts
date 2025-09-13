import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnInit {
  categoryForm!: FormGroup;
  categoryId!: string;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    this.categoryService.getById(this.categoryId).subscribe((cat) => {
      this.categoryForm.patchValue(cat);
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.categoryService.update(this.categoryId, this.categoryForm.value).subscribe(() => {
        this.router.navigate(['/admin/categories']);
      });
    }
  }
}
