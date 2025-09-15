import { Component, Input } from '@angular/core';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/models/user.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent {
  @Input() postId: string = '';
  @Input() postType: String = '';
  isEdit: { [key: string]: boolean } = {};
  upcomment: { [key: string]: string } = {};
  comments: any[] = [];
  currentUser: User | null = null;
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.getComments();
  }

  getComments() {
    this.reviewService.getCommentOfPostId(this.postId).subscribe((data) => {
      this.comments = data.comment;
      this.isthisOwnerOfComment();
    });
  }

  comment = '';
  del = false;

  isthisOwnerOfComment() {
    this.comments.forEach((c) => {
      if (c.userId === this.currentUser?._id) {
        this.del = true;
      }
    });
  }

  addComment() {
    if (!this.comment || this.comment.trim() === '') {
      console.log("Can't add empty comment");
      return;
    }
    const comment = {
      postId: this.postId,
      postType: this.postType,
      userId: this.currentUser?._id,
      comment: this.comment,
    };

    this.reviewService.addComment(comment).subscribe((data) => {
      console.log(data);
      this.getComments();
    });
  }
  deleteComment(commentId: string) {
    this.reviewService.deleteComment(commentId).subscribe((data) => {
      console.log('comment deleted', data);
      this.getComments();
    });
  }

  toggleEdit(commentId: string, currentText: string) {
    this.isEdit[commentId] = true;
    this.upcomment[commentId] = currentText;
  }

  updateComment(commentId: string) {
    const newText = this.upcomment[commentId];
    if (!newText?.trim()) return;
    this.reviewService.updateComment(commentId, newText).subscribe((data) => {
      this.getComments();
      this.isEdit[commentId] = false;
    });
  }
  cancelEdit(commentId: string) {
    this.isEdit[commentId] = false;
  }
}
