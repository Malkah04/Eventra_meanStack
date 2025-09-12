import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const user = this.authService.getCurrentUser();

    if (!user) {
      // لو مفيش يوزر (مش داخل)
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (requiredRoles && !requiredRoles.includes(user.role?.toLowerCase())) {
      // لو دور المستخدم مش مطابق للأدوار المطلوبة
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
