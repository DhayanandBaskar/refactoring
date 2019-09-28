import invoices from "./invoice.json";
import plays from "./plays.json";
import { statement } from "./statement.js";

console.log(statement(invoices, plays));
