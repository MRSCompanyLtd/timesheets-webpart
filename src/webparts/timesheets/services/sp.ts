import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import IAccount from "../interfaces/IAccount";
import { IItemAddResult } from "@pnp/sp/items";
import { Web } from "@pnp/sp/webs"; 
import { getGUID } from "@pnp/common";
import ITimesheet from "../interfaces/ITimesheet";
import IProject from "../interfaces/IProject";

const AccountSelectFields: string[] = [
    "BillingCode",
    "CompanyPhone",
    "CompanyWebsite",
    "CountryOrRegion",
    "Created",
    "Modified",
    "State",
    "Status",
    "Street",
    "City",
    "ID",
    "Title",
    "Notes"
];

const web = Web("https://dperk.sharepoint.com/sites/TimesheetsDev");

export const getClients = async (lastModified = new Date(0).toISOString()): Promise<IAccount[]> => {
    try {
        const items: IAccount[] = await web.lists.getByTitle("Accounts").items.select(
            ...AccountSelectFields
        ).usingCaching().filter(`Modified ge datetime'${lastModified}'`).get();

        return items;
    }
    catch (e) {
        console.log(e);

        return [];
    }
};

export const getClientById = async (id: number): Promise<IAccount | null> => {
    try {
        const item: IAccount = await web.lists.getByTitle("Accounts").items.getById(id).select(
            ...AccountSelectFields
        ).get();

        return item;
    }
    catch {

        return null;
    }
};

export const getProjects = async (lastModified = new Date(0).toISOString()): Promise<any[]> => {
    try {
        const items: any[] = await web.lists.getByTitle("Projects")
            .items.usingCaching().filter(`Modified ge datetime'${lastModified}'`)
            .select("ID", "Title", "BillingCode", "Client/Id", "Client/Title", "Value", "Status", "Description")
            .expand("Client").get();

        return items;
    }
    catch (e) {
        console.log(e);

        return [];
    }
};

export const getProjectsByClient = async (id: number): Promise<IProject[]> => {
    try {
        const items: any[] = await web.lists.getByTitle("Projects")
            .items.usingCaching().filter(`ClientId eq '${id}'`)
            .select("ID", "Title", "BillingCode", "Client/Id", "Client/Title", "Value", "Status", "Description")
            .expand("Client").get();

        return items;
    }
    catch (e) {
        console.log(e);

        return [];
    }
};

export const getProjectRoles = async (projectId: number): Promise<any> => {
    try {
        const items: any[] = await web.lists.getByTitle("Project Roles")
        .items.usingCaching()
        .select("ID", "Hours", "HourlyRate", "ProjectId", "Project/Title", "Project/ID", "ProjectRole")
        .filter(`ProjectId eq '${projectId}'`)
        .expand('Project').get();

        return items;
    }

    catch {
        return [];
    }
};

export const getTimesheets = async (client = 0, project = 0): Promise<any[]> => {
    const selectFields: string[] = ["TimesheetDate", "Description", "Consultant/Name", "Hours", "Client", "Role", "Project", "Client/ID", "Client/Title", "Project/ID", "Project/Title", "Role/ID", "Role/ProjectRole"];
    try {
        if (client === 0 && project === 0) {
            const items: any[] = await web.lists.getByTitle("Timesheets")
                .items.usingCaching()
                .select(...selectFields)
                .expand("Consultant", "Client", "Project", "Role").get();

            return items;
        }
        else if (client > 0 && project === 0) {
            const items: any[] = await web.lists.getByTitle("Timesheets")
                .items.usingCaching()
                .select(...selectFields)
                .filter(`ClientId eq '${client}'`)
                .expand("Consultant", "Client", "Project", "Role").get();

            return items;
        }
        else if (client === 0 && project > 0) {
            const items: any[] = await web.lists.getByTitle("Timesheets")
                .items.usingCaching()
                .select(...selectFields)
                .filter(`ProjectId eq '${project}'`)
                .expand("Consultant", "Client", "Project", "Role").get();
            
            return items;
        }
        else if (client > 0 && project > 0) {
            const items: any[] = await web.lists.getByTitle("Timesheets")
                .items.usingCaching()
                .select(...selectFields)
                .filter(`ClientId eq '${client}' AND ProjectId eq '${client}'`)
                .expand("Consultant", "Client", "Project", "Role").get();

            return items;
        }
    }

    catch (e) {
        console.log(e);

        return [];
    }
};

export const submitTimesheet = async (data: ITimesheet): Promise<IItemAddResult | false> => {
    try {
        const newItem: IItemAddResult = await web.lists.getByTitle("Timesheets").items.add({
            Title: getGUID(),
            ConsultantId: await sp.web.currentUser.select("Id").get().then((res: any) => { return res.Id; }),
            TimesheetDate: data.date,
            ClientId: data.clientId,
            ProjectId: data.projectId,
            RoleId: data.roleId,
            Hours: data.hours,
            Description: data.description
        });

        return newItem;
    }

    catch (e) {
        console.log(e);

        return false;
    }
};