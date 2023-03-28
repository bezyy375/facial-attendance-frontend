import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';

// material-ui
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    Modal,
    OutlinedInput,
    Stack,
    Typography
} from '@material-ui/core';

import Webcam from 'react-webcam';

import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import configData from '../../../config';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import MainCard from '../../../ui-component/cards/MainCard';

import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import ViewPhotoIcon from '@material-ui/icons/Preview';
import NextStepIcon from '@material-ui/icons/KeyboardTab';
import CapturePictureIcon from '@material-ui/icons/CameraAlt';
import ReCapturePictureIcon from '@material-ui/icons/FlipCameraIos';
import MarkAttendanceIcon from '@material-ui/icons/CheckCircle';

//==============================|| SAMPLE PAGE ||==============================//

const useStyles = makeStyles((theme) => ({
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[700],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: theme.palette.grey[100] + ' !important',
        color: theme.palette.grey[900] + '!important',
        fontWeight: 500
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    loginInput: {
        ...theme.typography.customInput
    },

    interImage: {
        margin: '16px'
    }
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const AddMember = (props, { ...others }) => {
    const classes = useStyles();

    const account = useSelector((state) => state.account);

    const [avatarPreview, setAvatarPreview] = useState(
        'https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg'
    );

    const [userPicture, setUserPicture] = useState('--');
    const [showPhotos, setShouldShowPhotos] = useState(false);
    const [photosPath, setPhotosPath] = useState(null);
    const [enlargedPhotoPath, setEnlargedPhotoPath] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [enlargePhotoModalOpen, setEnlargePhotoModal] = useState(false);

    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [hasCaptured, setHasCaptured] = React.useState(false);
    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setHasCaptured(true);
    }, [webcamRef, setImgSrc]);

    const renderInterInfo = (textToDisplay, imageName) => {
        return (
            <Box
                // style={{ margin: 5 }}
                display="flex"
                textAlign="center"
                flexDirection="column"
                alignItems={'center'}
                alignSelf={'center'}
                justifyContent={'center'}
                backgroundColor={'lightgray'}
                borderRadius={3}
                margin={3}
            >
                <img
                    className={classes.interImage}
                    alt="OriginalFace"
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    src={photosPath + imageName}
                />
                <Typography variant="h6" color="secondary">
                    {textToDisplay}
                </Typography>
                <Button
                    onClick={() => {
                        setEnlargedPhotoPath(photosPath + imageName);
                        setEnlargePhotoModal(true);
                    }}
                    variant="contained"
                    component="label"
                    startIcon={<ViewPhotoIcon />}
                >
                    Enlarge Photo
                </Button>
            </Box>
        );
    };

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
        <MainCard title="Add New Member">
            <Formik
                initialValues={{
                    name: '',
                    picture: userPicture,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('Full name is required'),
                    picture: Yup.mixed().required('Member Picture is required')
                })}
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                    let formData = new FormData();

                    formData.append('name', values.name);
                    formData.append('picture', userPicture);
                    formData.append('organization', 1);
                    try {
                        axios
                            .post(configData.API_SERVER + 'member/', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    Authorization: `Bearer ${account.token}`
                                }
                            })
                            .then(function (response) {
                                console.log({ apiResonse: response });
                                if (response.data.success) {
                                    console.log({ responseData: response.data });
                                    setErrors({ submit: response.data.msg });
                                    setSubmitting(false);

                                    setShouldShowPhotos(true);
                                    setPhotosPath(response.data.inter_photos_dir);
                                } else {
                                    setStatus({ success: false });
                                    setErrors({ submit: response.data.msg });
                                    setSubmitting(false);
                                    setShouldShowPhotos(false);
                                    setPhotosPath(null);
                                }
                            })
                            .catch(function (error) {
                                console.log({ errorMessage: error.response.data.msg });
                                setStatus({ success: false });
                                // setErrors({ submit: error.response.data.msg });
                                setErrors({ submit: error.response.data.msg || 'Member adding failed. ' });
                                setSubmitting(false);
                                setShouldShowPhotos(false);
                                setPhotosPath(null);
                            });
                    } catch (err) {
                        console.error({ loginErrorMsg: err });
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.name && errors.name)} className={classes.loginInput}>
                            <InputLabel htmlFor="outlined-adornment-fullname">Full Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-fullname"
                                type="text"
                                value={values.name}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Full Name"
                                inputProps={{
                                    classes: {
                                        notchedOutline: classes.notchedOutline
                                    }
                                }}
                            />
                            {touched.name && errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {errors.name}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl>
                            <Box
                                sx={{ width: 320 }}
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
                                    sx={{ width: 320, mt: 2 }}
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

                                                        setAvatarPreview(fileReader.result);
                                                    }
                                                };
                                                fileReader.readAsDataURL(e.target.files[0]);
                                            }}
                                        />
                                    </Button>

                                    <span style={{ margin: 2 }} />

                                    <Button
                                        onClick={() => {
                                            setModalOpen(true);
                                        }}
                                        variant="contained"
                                        component="label"
                                        startIcon={<CapturePictureIcon />}
                                    >
                                        Capture Photo
                                    </Button>
                                </Box>
                            </Box>
                        </FormControl>

                        {errors.submit && (
                            <Box
                                sx={{
                                    mt: 3
                                }}
                            >
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        {showPhotos && (
                            <Box
                                // style={{ margin: 5 }}
                                display="flex"
                                textAlign="center"
                                flexDirection="row"
                                alignItems={'center'}
                                alignSelf={'center'}
                                justifyContent={'center'}
                            >
                                {/* {photosPath} */}

                                {renderInterInfo('Original Image', 'original.png')}
                                <NextStepIcon color={'secondary'} />
                                {renderInterInfo('Extracted Face', 'face_boundary.png')}
                                <NextStepIcon color={'secondary'} />
                                {renderInterInfo('Face Landmarks', 'face_landmarks.png')}
                                <NextStepIcon color={'secondary'} />
                                {renderInterInfo('Cropped Face', 'face_cropped.png')}
                            </Box>
                        )}
                        <Box
                            sx={{
                                mt: 2
                            }}
                        >
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Add Member
                                </Button>
                            </AnimateButton>
                        </Box>
                        {isSubmitting ? (
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        ) : null}
                    </form>
                )}
            </Formik>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
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
                                    startIcon={<MarkAttendanceIcon color="primaryLight" />}
                                    color="success"
                                    onClick={() => {
                                        try {
                                            const blob = dataURLtoBlob(imgSrc);
                                            setUserPicture(blob);

                                            setAvatarPreview(imgSrc);
                                            setModalOpen(false);
                                        } catch (err) {
                                            console.error({ loginErrorMsg: err });
                                            setModalOpen(false);
                                        }
                                    }}
                                >
                                    Select
                                </Button>
                            </AnimateButton>
                        </Box>

                        <Button
                            onClick={() => {
                                setModalOpen(false);
                            }}
                            color={'error'}
                            variant="text"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={enlargePhotoModalOpen}
                onClose={() => {
                    setEnlargePhotoModal(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Box
                        // style={{ margin: 5 }}
                        display="flex"
                        textAlign="center"
                        flexDirection="column"
                        alignItems={'center'}
                        alignSelf={'center'}
                    >
                        <img src={enlargedPhotoPath} />

                        <Button
                            onClick={() => {
                                setEnlargePhotoModal(false);
                            }}
                            color={'error'}
                            variant="text"
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </MainCard>
    );
};

export default AddMember;
