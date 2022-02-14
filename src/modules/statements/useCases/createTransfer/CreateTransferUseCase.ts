import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@/modules/users/repositories/IUsersRepository';

import { OperationType } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementError } from '../createStatement/CreateStatementError';
import { ICreateTransferDTO } from '../createStatement/ICreateTransferDTO';

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    user_id,
    sender_id,
  }: ICreateTransferDTO) {
    const userFound = await this.usersRepository.findById(user_id);
    const senderFound = await this.usersRepository.findById(sender_id);

    if (!userFound || !senderFound) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const transferCreated = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    return transferCreated;
  }
}

export { CreateTransferUseCase };
