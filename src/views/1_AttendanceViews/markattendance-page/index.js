import React from 'react';

// material-ui
import { Button, LinearProgress, Typography } from '@material-ui/core';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';

import Webcam from 'react-webcam';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { Box } from '@material-ui/system';

import { useSelector } from 'react-redux';
import axios from 'axios';
import configData from '../../../config';

import MarkAttendanceIcon from '@material-ui/icons/CheckCircle';
import CapturePictureIcon from '@material-ui/icons/CameraAlt';
import ReCapturePictureIcon from '@material-ui/icons/FlipCameraIos';

//==============================|| SAMPLE PAGE ||==============================//

const MarkAttendance = () => {
    const account = useSelector((state) => state.account);

    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCaptured, setHasCaptured] = React.useState(false);
    const [attendanceMessage, setAttendanceMessage] = React.useState('');

    const [markedDetails, setMarkedDetails] = React.useState(null);
    const [isMarkingAttendance, setisMarkingAttendance] = React.useState(null);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setHasCaptured(true);
    }, [webcamRef, setImgSrc]);

    const dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    return (
        <MainCard title="Mark Attendance">
            <Typography variant="body2">Please look in to camera and click the 'Capture Button' when you are ready.</Typography>
            <Box
                // style={{ margin: 5 }}
                display="flex"
                textAlign="center"
                flexDirection="column"
                alignItems={'center'}
                alignSelf={'center'}
            >
                {hasCaptured ? (
                    <img src={imgSrc} />
                ) : (
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored={true} />
                )}

                <Box
                    sx={{ margin: 1 }}
                    display="flex"
                    textAlign="center"
                    justifyContent="center"
                    flexDirection="row"
                    alignItems={'center'}
                    alignSelf={'center'}
                >
                    <AnimateButton>
                        <Button
                            disableElevation={false}
                            disabled={false}
                            fullWidth={false}
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={hasCaptured ? <ReCapturePictureIcon /> : <CapturePictureIcon />}
                            onClick={() => {
                                setAttendanceMessage('');
                                if (hasCaptured) setHasCaptured(false);
                                else capture();
                            }}
                        >
                            {hasCaptured ? 'Recapture' : 'Capture photo'}
                        </Button>
                    </AnimateButton>
                    <span style={{ margin: 5 }} />

                    <AnimateButton>
                        <Button
                            disableElevation={false}
                            disabled={!hasCaptured}
                            fullWidth={false}
                            size="large"
                            type="submit"
                            variant="contained"
                            component="label"
                            // startIcon={<MarkAttendanceIcon color={hasCaptured ? 'success' : 'gray'} />}
                            startIcon={<MarkAttendanceIcon />}
                            color="success"
                            onClick={() => {
                                setisMarkingAttendance(true);
                                setAttendanceMessage('');

                                let formData = new FormData();

                                formData.append('terminal_code', '2');

                                const blob = dataURLtoBlob(imgSrc);
                                formData.append('picture', blob);

                                try {
                                    axios
                                        .post(configData.API_SERVER + 'attendance/', formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                                Authorization: `Bearer ${account.token}`
                                            }
                                        })
                                        .then(function (response) {
                                            // console.log({ apiResonse: response });
                                            if (response.data.success) {
                                                console.log({ responseData: response.data });
                                                setisMarkingAttendance(false);
                                                setAttendanceMessage(response.data.msg + '--- Member: ' + response.data.member.name);
                                                setHasCaptured(false);
                                            } else {
                                                setisMarkingAttendance(false);
                                                setAttendanceMessage(response.data.msg);
                                                setHasCaptured(false);
                                            }
                                        })
                                        .catch(function (error) {
                                            console.log({ errorMessage: error.response.data.msg });
                                            setisMarkingAttendance(false);
                                            setAttendanceMessage(error.response.data.msg);
                                            setHasCaptured(false);
                                        });
                                } catch (err) {
                                    console.error({ loginErrorMsg: err });
                                    setisMarkingAttendance(false);
                                    setAttendanceMessage('Attendance Marking Failed');
                                }
                            }}
                        >
                            Mark Attendance
                        </Button>
                    </AnimateButton>
                </Box>
                <Typography variant="body2">{attendanceMessage}</Typography>

                {isMarkingAttendance ? (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                ) : null}
            </Box>
        </MainCard>
    );
};

export default MarkAttendance;
