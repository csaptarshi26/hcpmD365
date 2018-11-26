import { timesheetLineList } from './tsLineListContact.interface';
export interface timesheetTableContact{
    ApprovalStatus:string,
    EmplId:string,
    PeriodFrom:Date,
    PeriodTo:Date,
    TimesheetNumber:string
    TimesheetLineList:timesheetLineList[]
}