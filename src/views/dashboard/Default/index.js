import React from 'react';

// material-ui
import { Typography } from '@material-ui/core';
import MainCard from '../../../ui-component/cards/MainCard';

// project imports

//==============================|| SAMPLE PAGE ||==============================//

const Dashboard = () => {
    return (
        <MainCard title="Facial Attendance">
            <Typography variant="body2">Camera based facial attendance system.</Typography>
        </MainCard>
    );
};

export default Dashboard;
