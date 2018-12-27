import { timesheetLineList } from './tsLineListContact.interface';
import { timesheetPeriodDateList } from './timesheetPeriodDate.interface';
export interface timesheetTableContact{
    ApprovalStatus:string,
    EmplId:string,
    PeriodFrom:Date,
    PeriodTo:Date,
    TimesheetNumber:string,
    IsEditable: boolean,
    IsDeleted:Number,
    TimesheetLineList:timesheetLineList
    TimesheetPeriodDateList:timesheetPeriodDateList
}