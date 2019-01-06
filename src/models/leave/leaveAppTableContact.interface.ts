import { LeaveAppLineContract } from "./leaveAppLineContract.interface";


export interface LeaveAppTableContract{
    ApplicationLine:LeaveAppLineContract;
    EmpId:string;
    Error:boolean;
    IsDeleted:boolean;
    IsEditable:boolean;
    LeaveApplicationCode:string;
    PeriodFrom:Date;
    PeriodTo:Date;
    PersonnelNumber:string;
    Remarks:string;
    Status:string;
}