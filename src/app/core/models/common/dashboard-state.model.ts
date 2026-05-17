import { Customer } from '../customer/customer.model';
import { Account } from '../account/account.model';

export interface DashboardState {
  selectedCustomer: Customer | null;
  selectedAccount: Account | null;
}
