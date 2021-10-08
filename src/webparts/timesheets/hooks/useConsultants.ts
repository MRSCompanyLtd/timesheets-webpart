import * as React from "react";
import IConsultant from "../interfaces/IConsultant";
import { getConsultants } from "../services/graph";

const useConsultants = () => {
    const [consultants, setConsultants] = React.useState<IConsultant[]>([]);
    const [status, setStatus] = React.useState<'standby' | 'pending' | 'updated' | 'error'>('standby');

    React.useEffect(() => {
        async function get() {
            try {
                setStatus('pending');
                const cons: IConsultant[] = await getConsultants().then((res: any[]) => {
                    return res.map((u: any) => {
                        return {
                            displayName: u.displayName,
                            givenName: u.givenName,
                            surname: u.surname,
                            mail: u.mail,
                            userPrincipalName: u.userPrincipalName,
                            id: u.id
                        };
                    });
                });
                setConsultants(cons);
                setStatus('updated');
            }
            catch {
                setStatus('error');
            }
        }

        get();
    }, []);

    return { consultants, status };
};

export default useConsultants;