import * as React from 'react';
import IAccount from "../interfaces/IAccount";
import { getClients } from "../services/sp";

const useAccounts = () => {
    const [accounts, setAccounts] = React.useState<IAccount[]>([]);
    const [status, setStatus] = React.useState<'standby' | 'pending' | 'updated' | 'error'>('standby');
    const [lastModified, setLastModified] = React.useState<string>(new Date(0).toISOString());

    React.useEffect(() => {
        async function get() {
            try {
                setStatus('pending');
                const accs: IAccount[] = await getClients(lastModified);
                setAccounts(accs);
                setStatus('updated'); 
                setLastModified(new Date().toISOString());               
            }
            catch {
                setStatus('error');
                setLastModified(new Date(0).toISOString());
            }
        }

        get();
        
    }, []);

    return {accounts, status};
};

export default useAccounts;