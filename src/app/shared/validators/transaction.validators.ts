import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import {
  MAX_TRANSACTION_AMOUNT,
  MIN_MERCHANT_LENGTH,
  MAX_MERCHANT_LENGTH,
} from '../../core/constants/app.constants';

export function positiveAmountValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null;
    }

    const num = Number(value);

    if (isNaN(num) || num <= 0) {
      return { positiveAmount: true };
    }

    if (!/^\d+(\.\d{1,2})?$/.test(String(value))) {
      return { maxDecimals: true };
    }

    if (num > MAX_TRANSACTION_AMOUNT) {
      return {
        maxAmount: {
          max: MAX_TRANSACTION_AMOUNT,
          actual: num,
        },
      };
    }

    return null;
  };
}

export function notFutureDateValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const selectedDate = new Date(value);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return selectedDate > today
      ? { futureDate: true }
      : null;
  };
}

export function merchantLengthValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value: string =
      control.value ?? '';

    if (!value) {
      return null;
    }

    if (value.length < MIN_MERCHANT_LENGTH) {
      return {
        merchantTooShort: {
          min: MIN_MERCHANT_LENGTH,
        },
      };
    }

    if (value.length > MAX_MERCHANT_LENGTH) {
      return {
        merchantTooLong: {
          max: MAX_MERCHANT_LENGTH,
        },
      };
    }

    return null;
  };
}

export function debitBalanceValidator(
  getBalance: () => number
): ValidatorFn {
  return (
    group: AbstractControl
  ): ValidationErrors | null => {
    const type = group.get('type')?.value;
    const amount = Number(
      group.get('amount')?.value ?? 0
    );

    if (type === 'Debit') {
      const balance = getBalance();

      if (amount > balance) {
        return {
          insufficientBalance: {
            balance,
            requested: amount,
          },
        };
      }
    }

    return null;
  };
}
