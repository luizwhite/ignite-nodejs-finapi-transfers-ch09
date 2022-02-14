import { OperationType, Statement } from '../entities/Statement';

interface IBalanceMapDTO {
  statement: Statement[];
  balance: number;
  source_user_id: string;
}

/* eslint-disable no-nested-ternary */
class BalanceMap {
  static toDTO({ statement, balance, source_user_id }: IBalanceMapDTO) {
    const parsedStatement = statement.map(
      ({
        id,
        user_id,
        sender_id,
        amount,
        description,
        type,
        created_at,
        updated_at,
      }) => {
        const description_detail =
          type === OperationType.TRANSFER
            ? user_id === source_user_id
              ? 'IN'
              : 'OUT'
            : undefined;

        return {
          id,
          sender_id: sender_id || undefined,
          amount,
          type,
          description,
          description_detail,
          created_at,
          updated_at,
        };
      }
    );

    return {
      statement: parsedStatement,
      balance,
    };
  }
}

export { BalanceMap };
