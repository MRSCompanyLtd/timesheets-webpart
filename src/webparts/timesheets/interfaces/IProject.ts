import IAccount from "./IAccount";

export default interface IProject {
    ID: number;
    Title: string;
    Client: IAccount;
    Value: number;
    BillingCode: string;
    Status: string;
    Description: string;
}