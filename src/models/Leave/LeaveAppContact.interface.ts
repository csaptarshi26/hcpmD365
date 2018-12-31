import { LeaveAppLine } from './LeaveAppLine.interface';

export interface LeaveApp{
    ApplicationLine:LeaveAppLine;
    IsDeleted:boolean;
    IsEditable:boolean;
    LeaveApplicationCode:string;
    PeriodFrom:Date;
    PeriodTo:Date;
    PersonnelNumber:string;
    Remarks:string;
    Status:string;
}