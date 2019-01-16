import { BenefitContract } from './workerBenefit.interface';
import { PayrollContract } from './workerPayroll.interface';
export interface SalaryContract{
    BenefitList:BenefitContract;
    Name:string;
    PayrollList:PayrollContract[];
    PersonnelNumber:string;
    ValidFrom:Date;
    ValidTo:Date;
}