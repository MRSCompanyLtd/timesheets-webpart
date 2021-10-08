import * as React from "react";
import ITimesheet from "../interfaces/ITimesheet";
import { getTimesheets } from "../services/sp";

const useTimesheets = (client = 0, project = 0) => {
    const [timesheets, setTimesheets] = React.useState<ITimesheet[]>([]);
    const [update, setUpdate] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<'standby' | 'pending' | 'updated' | 'error'>('standby');

    const updateTimesheets = React.useCallback(() => { setUpdate((u: boolean) => !u); }, []);

    React.useEffect(() => {
        async function get() {
            setStatus('pending');
            try {
                const ts: ITimesheet[] = await getTimesheets(client, project).then((res: any[]) => {
                    return res.map((item: any) => {
                        return {
                            client: item.Client,
                            clientId: item.Client?.ID ?? 0,
                            project: item.Project,
                            projectId: item.Project?.ID ?? 0,
                            role: item.Role,
                            roleId: item.Role?.ID ?? 0,
                            hours: item.Hours,
                            description: item.Description,
                            date: item.TimesheetDate
                        };
                    });
                });
                setTimesheets(ts);
                setStatus('updated');
            }
            catch (e) {
                console.log(e);
                setStatus('error');
            }
    
        }

        get();
    }, [update]);

    return { timesheets, status, updateTimesheets };
};

export default useTimesheets;