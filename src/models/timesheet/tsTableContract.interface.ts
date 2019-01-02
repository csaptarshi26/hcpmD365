import { TimesheetLineList } from './tsLineListContact.interface';
import { TimesheetPeriodDateList } from './timesheetPeriodDate.interface';
export interface TimesheetTableContact{
    ApprovalStatus:string,
    EmplId:string,
    PeriodFrom:Date,
    PeriodTo:Date,
    TimesheetNumber:string,
    IsEditable: boolean,
    IsDeleted:Number,
    TimesheetLineList:TimesheetLineList
    TimesheetPeriodDateList:TimesheetPeriodDateList
}