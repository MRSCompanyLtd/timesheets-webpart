import IAccount from "./IAccount";
import IProject from "./IProject";

export default interface ITimesheet {
    clientId: number;
    client?: IAccount;
    projectId: number;
    project?: IProject;
    roleId: number;
    role?: any;
    description: string;
    hours: number;
    date: Date;
}