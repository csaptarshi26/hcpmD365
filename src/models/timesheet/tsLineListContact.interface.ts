import { TimesheetLineDateList } from "./tsLineDateListContact.interface";

export interface TimesheetLineList{    
    CategoryId:string;
    IsDeleted:Number;
    LineNum:Number;
    ProjActivityNumber:string;
    ProjId:string;
    ProjName:string;
    TimesheetLineDateList:TimesheetLineDateList;
    TotalHrs:any;
}