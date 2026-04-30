import { StatusCodes } from 'http-status-codes';
import { AppError } from '../middlewares/errorHandler';
import { UserRepository } from '../repositories/user.repository';
import type { User } from '../repositories/user.repository';


export class UserService {
  private userRepo = new UserRepository();

  async findAll(pagination: ReturnType<typeof import('../utils/pagination').getPaginationParams>) {
    return this.userRepo.findAll(pagination);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
    return user;
  }

  async update(id: string, data: Partial<{ name: string; email: string }>): Promise<User | null> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
    return this.userRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
    return this.userRepo.delete(id);
  }
}
