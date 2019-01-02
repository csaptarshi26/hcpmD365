import { LeaveAppLineContract } from "./leaveAppLineContract.interface";


export interface LeaveAppTableContract{
    ApplicationLine:LeaveAppLineContract
    IsDeleted:boolean;
    IsEditable:boolean;
    LeaveApplicationCode:string;
    PeriodFrom:Date;
    PeriodTo:Date;
    PersonnelNumber:string;
    Remarks:string;
    Status:string;
}