import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TransactionDialog from "./TransactionsDialog";

const useStyles = makeStyles({
    root: {
        minWidth: 150,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const AccountCard = ({account}) => {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {account.balance}€
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {account.accountNumber}
                </Typography>
                <Typography variant="body2" component="p">
                    Created at {account.createdAt.substr(0, 10)}
                </Typography>
            </CardContent>
            <CardActions>
                <Button color="secondary"
                        size="small"
                        onClick={() => setDialogOpen(true)}>
                    Transactions
                </Button>
            </CardActions>
            <TransactionDialog open={dialogOpen}
                               onClose={() => setDialogOpen(false)}
                               transactions={account.transactions}/>
        </Card>
    );
};

export default AccountCard;
