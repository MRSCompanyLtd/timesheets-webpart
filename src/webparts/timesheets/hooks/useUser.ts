import * as React from "react";
import { getCurrentUser } from "../services/graph";

const useUser = () => {
    const [user, setUser] = React.useState<any>(null);
    const [status, setStatus] = React.useState<'standby' | 'pending' | 'updated' | 'error'>('standby');

    React.useEffect(() => {
        async function get() {
            try {
                setStatus('pending');
                const curr: any = await getCurrentUser();
                setUser(curr);
                setStatus('updated');
            }
            catch {
                setStatus('error');
            }
        }

        get();

    }, []);

    return { user, status };
};

export default useUser;