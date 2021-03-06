import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {createCustomer} from '../../../service/customerService';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const emptyForm = {name: '', surname: '', email: '', phone: ''};

const CustomerForm = () => {
    const classes = useStyles();
    const [form, setForm] = useState(emptyForm);
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [formError, setFormError] = useState({});
    const [requestPending, setRequestPending] = useState(false);

    const requireFields = (errors) => {
        const requiredFields = Object.keys(errors)
            .filter(field => !!errors[field])
            .join(', ');

        setFeedback({
            severity: 'error',
            message: `Please fill required fields: ${requiredFields}`
        });
        openSnackbar();
    };

    const validateForm = () => {
        const errors = {};
        let valid = true;

        Object.keys(form)
            .filter(field => !form[field])
            .forEach(field => {
                errors[field] = true;
                valid = false;
            });
        setFormError(errors);

        if (!valid) requireFields(errors);

        return valid;
    };

    const resetForm = () => {
        setForm(emptyForm);
        setFormError({});
    };

    const onSubmit = () => {
        if (!validateForm()) return;

        setRequestPending(true);
        createCustomer(form)
            .then(res => {
                resetForm();
                setFeedback({
                    severity: 'success',
                    message: `You have successfully created a customer with id ${res.data.customerId}.`
                });
            })
            .catch(error => {
                let message;
                if (!error.response) {
                    message = 'Server is not responding, please try in a bit!';
                } else if (error.response.status === 409) {
                    message = 'This email is taken by another customer!';
                } else {
                    message = 'An error occurred while creating a customer!';
                }
                setFeedback({severity: 'error', message});
            })
            .finally(() => {
                setRequestPending(false);
                openSnackbar();
            });
    };

    const openSnackbar = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                Create Customer
            </Typography>
            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="firstName"
                            variant="outlined"
                            required
                            fullWidth
                            id="firstName"
                            error={formError.name}
                            value={form.name}
                            onChange={({target}) => setForm({...form, name: target.value})}
                            label="First Name"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            error={formError.surname}
                            value={form.surname}
                            onChange={({target}) => setForm({...form, surname: target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            error={formError.email}
                            value={form.email}
                            onChange={({target}) => setForm({...form, email: target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="phone"
                            label="Phone"
                            type="text"
                            id="phone"
                            error={formError.phone}
                            value={form.phone}
                            onChange={({target}) => setForm({...form, phone: target.value})}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={onSubmit}
                >
                    Save
                </Button>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={feedback.severity}>
                    {feedback.message}
                </Alert>
            </Snackbar>
            <Backdrop className={classes.backdrop} open={requestPending}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default CustomerForm;
