import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category },
      user: { id: userId },
    };
    console.log(newTransaction);
    if (!newTransaction) throw new BadRequestException('category not found');
    return await this.transactionRepository.save(newTransaction);
  }

  async findAll(userId: number) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
    if (!transactions) throw new BadRequestException('transactions not found');
    return transactions;
  }

  async findOne(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: { category: true },
    });
    if (!transaction) throw new BadRequestException('transaction not found');
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const updareTransaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!updareTransaction)
      throw new BadRequestException('transaction not found');
    return this.transactionRepository.update(id, updateTransactionDto);
  }

  async remove(id: number) {
    const deleteTransaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!deleteTransaction)
      throw new BadRequestException('transaction not found');
    return this.transactionRepository.delete(id);
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id } },
      relations: { category: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!transactions) throw new BadRequestException('transactions not found');
    return transactions;
  }
}
