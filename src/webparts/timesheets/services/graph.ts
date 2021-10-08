import { graph } from "@pnp/graph";
import { IUser } from "@pnp/graph/users";

export const getCurrentUser = async (): Promise<IUser | null> => {
    try {
        return await graph.me();
    }
    catch {
        return null;
    }
};

export const getConsultants = async (): Promise<IUser[]> => {
    try {
        const group: string = await graph.groups.filter(`displayName eq 'Billing Consultants'`).get().then((res: any) => {
            return res[0].id;
        });
        
        const consultants: IUser[] = await graph.groups.getById(group).members();

        return consultants;
    }
    catch {
        return [];
    }
};

export const getAdmins = async (): Promise<IUser[]> => {
    try {
        const group: string = await graph.groups.filter(`displayName eq 'Timesheets Admins'`).get().then((res: any) => {
            return res[0].id;
        });

        const admins: IUser[] = await graph.groups.getById(group).members();

        return admins;
    }
    catch {
        return [];
    }
};