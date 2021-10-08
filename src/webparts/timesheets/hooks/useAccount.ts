import * as React from "react";
import IAccount from "../interfaces/IAccount";
import { getClientById } from "../services/sp";

const useAccount = (id: number) => {
    const [account, setAccount] = React.useState<IAccount | null>();
    const [status, setStatus] = React.useState<'standby' | 'pending' | 'updated' | 'error'>('standby');

    React.useEffect(() => {
        async function get() {
            try {
                setStatus('pending');
                const acc: IAccount = await getClientById(id);
                setAccount(acc);
                setStatus('updated');           
            }
            catch {
                setStatus('error');
            }
        }

        get();
        
    }, []);

    return { account, status };
};

export default useAccount;