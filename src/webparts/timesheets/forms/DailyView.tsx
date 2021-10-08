import * as React from "react";
import { ActionButton, IIconProps, Label, Stack } from "@microsoft/office-ui-fabric-react-bundle";
import AddTimesheet from "./AddTimesheet";
import ITimesheet from "../interfaces/ITimesheet";
import useTimesheets from "../hooks/useTimesheets";
import styles from "./Daily.module.scss";

const DailyView: React.FC = () => {
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [hoursToday, setHoursToday] = React.useState<number>(0);
    const [disabled, setDisabled] = React.useState<{back: boolean, next: boolean}>({
        back: false,
        next: true
    });
    const [open, setOpen] = React.useState<boolean>(false);
    const { timesheets, status, updateTimesheets } = useTimesheets();

    const backIcon: IIconProps = { iconName: 'Back', styles: {root: { color: 'inherit' }}};
    const forwardIcon: IIconProps = { iconName: 'Forward', styles:{root: {textAlign: 'right', color: 'inherit'}}};

    function calcHours(): number {
        const today: any[] = timesheets.filter((t: ITimesheet) => new Date(Date.parse(t.date.toString())).toDateString() === selectedDate.toDateString());
        return today.reduce((inc: number, item: ITimesheet) => inc + item.hours, 0) ?? 0;
    }

    React.useEffect(() => {
        if (status !== 'pending') {
            setHoursToday(calcHours());
        }
    }, [status]);

    React.useEffect(() => {
        function checkDisabledNext(): boolean {
            return selectedDate > new Date(new Date().setDate(new Date().getDate() - 1));
        }
    
        function checkDisabledBack(): boolean {
            return selectedDate <= new Date(new Date().setMonth(new Date().getMonth() - 1));
        }

        setHoursToday(calcHours());
        setDisabled({
            back: checkDisabledBack(),
            next: checkDisabledNext()
        });
    }, [selectedDate]);


    function incrementDate() {
        let next: Date = selectedDate;
        setSelectedDate(new Date(next.setDate(next.getDate() + 1)));
    }

    function decrementDate() {
        let past: Date = selectedDate;
        setSelectedDate(new Date(past.setDate(past.getDate() - 1)));
    }

    return (
        <Stack tokens={{padding: '4px'}}>
            <div className={styles.controlBar}>
                <ActionButton iconProps={backIcon} onClick={decrementDate} text="Back" disabled={disabled.back} className={styles.actionButton} />
                    <Label className={styles.dateLabel}>{selectedDate.toDateString()}</Label>
                <ActionButton iconProps={forwardIcon} onClick={incrementDate} text="Next" disabled={disabled.next} className={styles.actionButton}
                    styles={{flexContainer: {flexDirection: 'row-reverse'}}} />
            </div>
            <div className={styles.today}>
                <div className={styles.todayContent} style={{maxHeight: open ? '140px' : '40px'}}>
                    <div className={styles.todayBar}>
                        <h3 style={{margin: '12px 0'}}>{`Today's entries (${hoursToday} hours entered)`}</h3>
                        <ActionButton onClick={() => setOpen(!open)} iconProps={{iconName: open ? 'ChevronUp' : 'ChevronDown'}} />
                    </div>
                    <div className={styles.entries}>
                    {timesheets.map((item: ITimesheet, index: number) => {
                        if (new Date(Date.parse(item.date.toString())).toDateString() === selectedDate.toDateString()) {
                            return (
                                <div className={styles.timesheetEntry} key={index}>
                                    {`${item.hours} hours on ${item.project.Title} for ${item.client.Title}`}    
                                </div>
                            );                            
                        }
                    })}
                    </div>
                </div>
                <AddTimesheet date={selectedDate} update={updateTimesheets} />
            </div>
        </Stack>
    );
};

export default DailyView;