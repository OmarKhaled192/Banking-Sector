import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  positiveAmountValidator,
  notFutureDateValidator,
  merchantLengthValidator,
  debitBalanceValidator
} from './transaction.validators';
import { MAX_TRANSACTION_AMOUNT } from '../../core/constants/app.constants';

// ─── Helper ───────────────────────────────────────────────────────────────────
function ctrl(value: unknown): AbstractControl {
  const c = new FormControl(value);
  c.setValue(value);
  return c;
}

describe('Transaction Validators', () => {

  // ══════════════════════════════════════════════════════════════════════
  // positiveAmountValidator
  // ══════════════════════════════════════════════════════════════════════

  describe('positiveAmountValidator()', () => {
    const validator = positiveAmountValidator();

    it('should return null for null value (no error when empty)', () => {
      expect(validator(ctrl(null))).toBeNull();
    });

    it('should return null for empty string (no error when empty)', () => {
      expect(validator(ctrl(''))).toBeNull();
    });

    it('should return { positiveAmount: true } for zero', () => {
      expect(validator(ctrl(0))).toEqual({ positiveAmount: true });
    });

    it('should return { positiveAmount: true } for negative value', () => {
      expect(validator(ctrl(-100))).toEqual({ positiveAmount: true });
    });

    it('should return null for valid positive amount (100)', () => {
      expect(validator(ctrl(100))).toBeNull();
    });

    it('should return null for amount with 1 decimal place (100.5)', () => {
      expect(validator(ctrl(100.5))).toBeNull();
    });

    it('should return null for amount with 2 decimal places (100.55)', () => {
      expect(validator(ctrl(100.55))).toBeNull();
    });

    it('should return { maxDecimals: true } for more than 2 decimal places (100.555)', () => {
      expect(validator(ctrl(100.555))).toEqual({ maxDecimals: true });
    });

    it(`should return { maxAmount } when amount > ${MAX_TRANSACTION_AMOUNT}`, () => {
      const result = validator(ctrl(MAX_TRANSACTION_AMOUNT + 1));
      expect(result).toEqual({
        maxAmount: { max: MAX_TRANSACTION_AMOUNT, actual: MAX_TRANSACTION_AMOUNT + 1 }
      });
    });

    it(`should return null for amount exactly equal to ${MAX_TRANSACTION_AMOUNT}`, () => {
      expect(validator(ctrl(MAX_TRANSACTION_AMOUNT))).toBeNull();
    });

    it('should return null for minimum valid amount (0.01)', () => {
      expect(validator(ctrl(0.01))).toBeNull();
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // notFutureDateValidator
  // ══════════════════════════════════════════════════════════════════════

  describe('notFutureDateValidator()', () => {
    const validator = notFutureDateValidator();

    it('should return null when value is null (empty)', () => {
      expect(validator(ctrl(null))).toBeNull();
    });

    it('should return null for today\'s date', () => {
      const today = new Date();
      expect(validator(ctrl(today))).toBeNull();
    });

    it('should return null for a past date', () => {
      const past = new Date('2020-01-01');
      expect(validator(ctrl(past))).toBeNull();
    });

    it('should return { futureDate: true } for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(validator(ctrl(tomorrow))).toEqual({ futureDate: true });
    });

    it('should return { futureDate: true } for a date far in the future', () => {
      const future = new Date('2099-12-31');
      expect(validator(ctrl(future))).toEqual({ futureDate: true });
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // merchantLengthValidator
  // ══════════════════════════════════════════════════════════════════════

  describe('merchantLengthValidator()', () => {
    const validator = merchantLengthValidator();

    it('should return null for empty string', () => {
      expect(validator(ctrl(''))).toBeNull();
    });

    it('should return null for null value', () => {
      expect(validator(ctrl(null))).toBeNull();
    });

    it('should return { merchantTooShort } for 2-character name', () => {
      const result = validator(ctrl('AB'));
      expect(result).toEqual({ merchantTooShort: { min: 3 } });
    });

    it('should return { merchantTooShort } for 1-character name', () => {
      expect(validator(ctrl('A'))).toEqual({ merchantTooShort: { min: 3 } });
    });

    it('should return null for exactly 3-character name', () => {
      expect(validator(ctrl('ABC'))).toBeNull();
    });

    it('should return null for a normal merchant name (e.g. Carrefour)', () => {
      expect(validator(ctrl('Carrefour'))).toBeNull();
    });

    it('should return null for exactly 50-character name', () => {
      expect(validator(ctrl('A'.repeat(50)))).toBeNull();
    });

    it('should return { merchantTooLong } for 51-character name', () => {
      const result = validator(ctrl('A'.repeat(51)));
      expect(result).toEqual({ merchantTooLong: { max: 50 } });
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // debitBalanceValidator (cross-field validator)
  // ══════════════════════════════════════════════════════════════════════

  describe('debitBalanceValidator()', () => {

    function makeGroup(type: string, amount: number, balance: number): AbstractControl {
      return new FormGroup({
        type: new FormControl(type),
        amount: new FormControl(amount)
      });
    }

    it('should return null for Credit transaction regardless of amount', () => {
      const balance = 1000;
      const validator = debitBalanceValidator(() => balance);
      const group = makeGroup('Credit', 50000, balance);
      expect(validator(group)).toBeNull();
    });

    it('should return null when Debit amount is less than balance', () => {
      const balance = 15320.55;
      const validator = debitBalanceValidator(() => balance);
      const group = makeGroup('Debit', 1000, balance);
      expect(validator(group)).toBeNull();
    });

    it('should return null when Debit amount equals balance exactly', () => {
      const balance = 15320.55;
      const validator = debitBalanceValidator(() => balance);
      const group = makeGroup('Debit', 15320.55, balance);
      expect(validator(group)).toBeNull();
    });

    it('should return { insufficientBalance } when Debit amount exceeds balance', () => {
      const balance = 15320.55;
      const validator = debitBalanceValidator(() => balance);
      const group = makeGroup('Debit', 20000, balance);
      expect(validator(group)).toEqual({
        insufficientBalance: { balance: 15320.55, requested: 20000 }
      });
    });

    it('should return null when type is empty string (no type selected)', () => {
      const balance = 500;
      const validator = debitBalanceValidator(() => balance);
      const group = makeGroup('', 1000, balance);
      expect(validator(group)).toBeNull();
    });
  });
});
