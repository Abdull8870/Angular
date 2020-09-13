export interface Bill {
  _id:string;
  name:string;
  payer:string;
  to:string[];
  amount:number;
}
