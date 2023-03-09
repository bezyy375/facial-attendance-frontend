import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

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
    OutlinedInput,
    Stack,
    Typography
} from '@material-ui/core';

import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import configData from '../../../config';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import MainCard from '../../../ui-component/cards/MainCard';

import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';

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
    }
}));

const AddMember = (props, { ...others }) => {
    const classes = useStyles();

    const account = useSelector((state) => state.account);

    const [avatarPreview, setAvatarPreview] = useState(
        'https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg'
    );

    const [userPicture, setUserPicture] = useState('--');

    return (
        <MainCard fullWidth={false} title="Add New Member">
            <Formik
                initialValues={{
                    name: 'Bilal Ameri',
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
                                } else {
                                    setStatus({ success: false });
                                    setErrors({ submit: response.data.msg });
                                    setSubmitting(false);
                                }
                            })
                            .catch(function (error) {
                                console.log({ errorMessage: error.response.data.msg });
                                setStatus({ success: false });
                                // setErrors({ submit: error.response.data.msg });
                                setErrors({ submit: error.response.data.msg || 'Member adding failed. ' });
                                setSubmitting(false);
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
                                sx={{ width: 300 }}
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

                                <Button
                                    sx={{ width: 150, height: 30 }}
                                    variant="contained"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                >
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
                    </form>
                )}
            </Formik>
        </MainCard>
    );
};

export default AddMember;
