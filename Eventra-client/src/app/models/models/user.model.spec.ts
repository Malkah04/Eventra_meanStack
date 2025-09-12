import { User } from './user.model';

describe('User', () => {
  it('should have required properties', () => {
    const user: User = {
      _id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      role: 'user',
      confirmEmailAt: new Date().toISOString(),
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    };

    expect(user).toBeTruthy();
    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
    expect(user.confirmEmailAt).toBeTruthy();
  });
});
