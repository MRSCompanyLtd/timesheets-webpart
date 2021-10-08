import * as React from 'react';
import IAccount from "../interfaces/IAccount";
import { getProjects } from "../services/sp";

const useProjects = () => {
    const [projects, setProjects] = React.useState<any[]>([]);
    const [status, setStatus] = React.useState<'standby' | 'pending' | 'updated' | 'error'>('standby');
    const [lastModified, setLastModified] = React.useState<string>(new Date(0).toISOString());

    React.useEffect(() => {
        async function get() {
            try {
                setStatus('pending');
                const proj: IAccount[] = await getProjects(lastModified);
                setProjects(proj);
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

    return {projects, status};
};

export default useProjects;