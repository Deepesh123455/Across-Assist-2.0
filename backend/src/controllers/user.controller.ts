import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendNoContent } from '../utils/apiResponse';
import { getPaginationParams } from '../utils/pagination';

export class UserController {
  private userService = new UserService();

  getAll = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const result = await this.userService.findAll(pagination);
    sendSuccess(res, result);
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.findById(req.user!.id);
    sendSuccess(res, user);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.findById(req.params.id);
    sendSuccess(res, user);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.update(req.params.id, req.body);
    sendSuccess(res, user, 'User updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.userService.delete(req.params.id);
    sendNoContent(res);
  };
}
