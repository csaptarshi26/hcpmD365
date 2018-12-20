import { timesheetLineDateList } from "./tsLineDateListContact.interface";

export interface timesheetLineList{    
    CategoryId:string;
    IsDeleted:Number;
    LineNum:Number;
    ProjActivityNumber:string;
    ProjId:string;
    ProjName:string;
    TimesheetLineDateList:timesheetLineDateList;
    TotalHrs:any;
}