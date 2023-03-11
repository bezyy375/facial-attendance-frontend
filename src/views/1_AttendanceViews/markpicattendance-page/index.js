import React, { useState } from 'react';

// material-ui
import { Avatar, Button, LinearProgress, Typography } from '@material-ui/core';

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

import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';

//==============================|| SAMPLE PAGE ||==============================//

const MarkPicAttendance = () => {
    const account = useSelector((state) => state.account);

    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCaptured, setHasCaptured] = React.useState(false);
    const [attendanceMessage, setAttendanceMessage] = React.useState('');

    const [markedDetails, setMarkedDetails] = React.useState(null);
    const [isMarkingAttendance, setisMarkingAttendance] = React.useState(null);

    const [avatarPreview, setAvatarPreview] = useState(
        'https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg'
    );
    const [userPicture, setUserPicture] = useState('--');

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setHasCaptured(true);
    }, [webcamRef, setImgSrc]);

    return (
        <MainCard title="Mark Attendance from Picture">
            <Typography variant="body2">Please select the photo to mark attendance.</Typography>
            <Box
                sx={{ width: 350 }}
                display="flex"
                textAlign="center"
                justifyContent="center"
                flexDirection="column"
                justifyItems={'center'}
                alignContent={'center'}
                alignItems={'center'}
                alignSelf={'center'}
                // backgroundColor={'pink'}
            >
                <Avatar sx={{ width: 300, height: 300 }} src={avatarPreview} />
                <Box
                    sx={{ width: 350, mt: 2 }}
                    display="flex"
                    textAlign="center"
                    justifyContent="center"
                    flexDirection="row"
                    // justifyItems={'center'}
                    // alignContent={'center'}
                    // alignItems={'center'}
                    // alignSelf={'center'}
                    // backgroundColor={'pink'}
                >
                    <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                        Choose Photo
                        <input
                            name="userPicture"
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            hidden
                            onChange={(e) => {
                                const fileReader = new FileReader();
                                fileReader.onload = () => {
                                    if (fileReader.readyState === 2) {
                                        setUserPicture(e.target.files[0]);

                                        setHasCaptured(true);

                                        setAvatarPreview(fileReader.result);
                                    }
                                };
                                fileReader.readAsDataURL(e.target.files[0]);
                            }}
                        />
                    </Button>
                    <span style={{ margin: 5 }} />
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<MarkAttendanceIcon />}
                        disabled={!hasCaptured}
                        disableElevation={false}
                        fullWidth={false}
                        size="large"
                        type="submit"
                        onClick={() => {
                            setisMarkingAttendance(true);
                            setAttendanceMessage('');

                            let formData = new FormData();

                            formData.append('terminal_code', '2');
                            formData.append('picture', userPicture);

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
                </Box>
            </Box>
            <Typography variant="body2">{attendanceMessage}</Typography>

            {isMarkingAttendance ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            ) : null}
        </MainCard>
    );
};

export default MarkPicAttendance;
