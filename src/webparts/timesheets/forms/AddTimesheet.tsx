import * as React from "react";
import { DefaultButton, Label, Spinner, SpinnerSize, Stack, TextField } from "@microsoft/office-ui-fabric-react-bundle";
import { ComboBox, DatePicker, IComboBox, IComboBoxOption } from "office-ui-fabric-react";
import useAccounts from "../hooks/useAccounts";
import IAccount from "../interfaces/IAccount";
import { getProjectRoles, getProjectsByClient, getTimesheets, submitTimesheet } from "../services/sp";
import ITimesheet from "../interfaces/ITimesheet";
import formStyle from "./Form.module.scss";
import { IItemAddResult } from "@pnp/sp/items";

interface IAddTimesheetProps {
    date?: Date;
    update: Function;
}

const initialState = (date = new Date()): ITimesheet => {
    return {
        clientId: 0,
        projectId: 0,
        roleId: 0,
        description: '',
        hours: 0,
        date: date
    };
};

const AddTimesheet: React.FC<IAddTimesheetProps> = ({ date = new Date(), update }) => {
    const [state, setState] = React.useState<ITimesheet>(initialState(date));
    const [tStatus, setTStatus] = React.useState<'pending' | 'updated' | 'error' | 'standby'>('standby');
    const [options, setOptions] = React.useState<IComboBoxOption[]>([]);
    const [pOptions, setPOptions] = React.useState<IComboBoxOption[]>([]);
    const [rOptions, setROptions] = React.useState<IComboBoxOption[]>([]);
    const [validated, setValidated] = React.useState<boolean>(false);
    const comboBoxRef = React.useRef<IComboBox>(null);
    const projectBoxRef = React.useRef<IComboBox>(null);
    const roleBoxRef = React.useRef<IComboBox>(null);
    const { accounts, status } = useAccounts();

    React.useEffect(() => {
        setState((s: ITimesheet) => {
            return {
                ...s,
                date
            };
        });
    }, [date]);

    React.useEffect(() => {
        if (status === 'updated') {
            const newOpts = accounts.map((item: IAccount) => {
                return {
                    key: item.ID,
                    text: item.Title
                };
            });
            setOptions(newOpts);
        }
    }, [status]);

    React.useEffect(() => {
        async function get() {
            return await getProjectsByClient(state.clientId);
        }

        if (status === 'updated' && state.clientId !== 0) {
            Promise.resolve(get().then((res: any) => {
                const proj: any = res.map((item: any) => {
                    return {
                        key: item.ID,
                        text: item.Title
                    };
                });
                setPOptions(proj);
            }));
        }

    }, [status, state.clientId]);

    React.useEffect(() => {
        async function get() {
            return await getProjectRoles(state.projectId);
        }

        Promise.resolve(get().then((res: any) => {
            const roles: any = res.map((item: any) => {
                return {
                    key: item.ID,
                    text: item.ProjectRole
                };
            });
            setROptions(roles);
        }));

    }, [state.projectId]);

    React.useEffect(() => {
        setValidated(
            state.clientId !== 0 && state.projectId !== 0 && state.roleId !== 0 && state.description !== '' && state.hours !== 0
        );
    }, [state]);

    async function submit(ts: ITimesheet): Promise<void> {
        try {
            setTStatus('pending');
            const res: IItemAddResult | false = await submitTimesheet(ts);
            if (!res) {
                setTStatus('error');
                return;
            }
            await update();
            setTStatus('updated');
        }

        catch {
            setTStatus('error');
        }
    }

    return (
        <Stack tokens={{childrenGap: 5}}>
            <div className={formStyle.container}>
                <Label className={formStyle.formH2}>New timesheet</Label>
                <ComboBox
                    label="Which client did you work for?"
                    options={options}
                    selectedKey={state.clientId}
                    componentRef={comboBoxRef}
                    onChange={(e: any, opt: IComboBoxOption) => setState({...state, clientId: Number(opt?.key ?? 0) }) }
                    placeholder="Select client"
                    className={formStyle.formItem}
                    required
                    />
                <ComboBox
                    label="Which project did you work on?"
                    options={pOptions}
                    selectedKey={state.projectId}
                    componentRef={projectBoxRef}
                    onChange={(e: any, opt: IComboBoxOption) => setState({...state, projectId: Number(opt?.key ?? 0)})}
                    placeholder="Select project"
                    className={formStyle.formItem}
                    required
                    />
                <ComboBox
                    label="Which role did you work as?"
                    options={rOptions}
                    selectedKey={state.roleId}
                    componentRef={roleBoxRef}
                    onChange={(e: any, opt: IComboBoxOption) => setState({...state, roleId: Number(opt?.key ?? 0)})}
                    placeholder="Select role"
                    className={formStyle.formItem}
                    required
                    />
                <TextField
                    type="number"
                    label="How many hours did you work?"
                    onChange={(e: any) => setState({...state, hours: e.target.value})}
                    placeholder="Enter hours"
                    value={state.hours.toString()}
                    min={0} max={12} step={0.5}
                    className={formStyle.formItem}
                    required
                    />
                <TextField
                    label="What did you do?"
                    onChange={(e: any) => setState({...state, description: e.target.value})}
                    placeholder="Describe what you did"
                    className={formStyle.formItem}
                    multiline
                    required
                    />
                <DatePicker
                    placeholder="Select date"
                    label="Which date did you work?"
                    value={state.date}
                    onSelectDate={(d: Date) => setState({...state, date: d})}
                    minDate={new Date(new Date().setMonth(new Date().getMonth() - 1))}
                    maxDate={new Date()}
                    className={formStyle.formItem}
                    disabled
                    />
                <Label className={formStyle.formItem}>Submit Timesheet</Label>
                {tStatus === "standby" && <DefaultButton text="Submit" disabled={!validated} className={formStyle.submitButton}
                onClick={async () => {
                    setTStatus('pending'); await submit(state); setState(initialState(state.date)); await getTimesheets();
                }} />}
                {tStatus === "pending" &&
                <div className={formStyle.loading}>
                    <Spinner size={SpinnerSize.large} />
                </div>
                }
                {tStatus === "updated" &&
                <div className={formStyle.loading} onClick={() => { setState(initialState(state.date)); setTStatus('standby'); }}>
                    Successful added. Click to add another.
                </div>
                }
                {tStatus === "error" &&
                <div className={formStyle.loading} onClick={() => { setState(initialState(state.date)); setTStatus('standby'); }}>
                    Error adding timesheet. Click to retry.
                </div>
                }
            </div>
        </Stack>
    );
};

export default AddTimesheet;