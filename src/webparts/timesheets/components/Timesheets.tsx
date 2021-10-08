import * as React from 'react';
import DailyView from '../forms/DailyView';
import { ITimesheetsProps } from './ITimesheetsProps';

const Timesheets: React.FC<ITimesheetsProps> = () => {

  return (
    <div>
      <DailyView />
    </div>
  );
};

export default Timesheets;