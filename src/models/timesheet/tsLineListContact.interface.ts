import { timesheetLineDateList } from "./tsLineDateListContact.interface";

export interface timesheetLineList{
    CategoryId:string,
    LineNum:Number,
    ProjActivityNumber:string,
    ProjId:string,
    TimesheetLineDateList:timesheetLineDateList[],
}