import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TransactionType, TransactionCategory } from '../../../../core/models/transaction/transaction.model';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {
  @Output() saved = new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);

  types$ = this.transactionService.types$;
  categories$ = this.transactionService.categories$;

  maxDate = new Date();
  errorMessage = '';

  form = this.fb.group({
    type: this.fb.nonNullable.control<TransactionType | ''>('', Validators.required),
    amount: this.fb.control<number | null>(
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100000)
      ]
    ),
    date: this.fb.control<Date | null>(
      new Date(),
      Validators.required
    ),
    merchant: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]
    ),
    category: this.fb.nonNullable.control<TransactionCategory | ''>('', Validators.required)
  });

  ngOnInit(): void { }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const account = this.accountService.selectedAccount();
    if (!account) return;

    const { type, amount, date, merchant, category } = this.form.getRawValue();

    if (!amount || !date || !type || !category) return;

    if (type === 'Debit' && amount > account.balance) {
      this.errorMessage = 'Debit cannot exceed account balance';
      return;
    }

    this.transactionService.add(
      {
        type: type as TransactionType,
        amount,
        date,
        merchant,
        category: category as TransactionCategory
      },
      account.id
    );

    const updatedBalance =
      type === 'Debit'
        ? account.balance - amount
        : account.balance + amount;

    this.accountService.updateBalance(updatedBalance);

    this.saved.emit(true);
    this.form.reset({
      type: '',
      amount: null,
      date: new Date(),
      merchant: '',
      category: ''
    });
  }

  cancel(): void {
    this.saved.emit(false);
  }
}