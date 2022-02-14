import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '@/shared/errors/AppError';

import { CreateTransferUseCase } from './CreateTransferUseCase';

class CreateTransferController {
  async handle(req: Request, res: Response) {
    const { amount, description } = req.body || {};
    const { user_id } = req.params || {};
    const { id: sender_id } = req.user || {};

    if (!amount || !description) {
      throw new AppError('Invalid transfer! Inform its amount and description');
    }

    if (!sender_id) throw new AppError('Invalid token!', 401);
    if (!user_id) throw new AppError('Invalid beneficiary user!');

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      amount,
      description,
      user_id,
      sender_id,
    });

    return res.json(transfer);
  }
}

export { CreateTransferController };
