import { Bill } from './bill.model'
import { Expense } from './expense.model'

export interface Project {
  _id: string;
  name: string;
  createdBy: string;
  users: string[];
  creator: string;
  bills:Bill[];
  expenses:Expense[];
}
