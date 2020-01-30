import React, { Component } from 'react';
import { Button, Dialog, Icon, Slide, withStyles } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import _ from '@lodash';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

function Transition(props) {
    return <Slide direction="right" {...props} />;
}
const BootstrapInput = withStyles(theme => ({
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);
const styles = theme => ({
    button: {
        position: 'absolute',
        right: 0,
        top: 160,
        minWidth: 48,
        width: 48,
        height: 48,
        opacity: .9,
        padding: 0,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        zIndex: 999,
        color: theme.palette.getContrastText('#A4A4A4'),
        backgroundColor: '#A4A4A4',
        '&:hover': {
            backgroundColor: '#A4A4A4',
            opacity: 1
        }
    },
    '@keyframes rotating': {
        from: {
            transform: 'rotate(0deg)'
        },
        to: {
            transform: 'rotate(360deg)'
        }
    },
    buttonIcon: {
        animation: 'rotating 3s linear infinite'
    },
    dialogPaper: {
        position: 'fixed',
        width: 380,
        maxWidth: '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        top: 0,
        height: '100%',
        minHeight: '100%',
        bottom: 0,
        right: 0,
        margin: 0,
        zIndex: 1000,
        borderRadius: 0
    }
});

class SettingsPanel extends Component {

    state = {
        openModal: false,
        language: '0',
    };
    componentDidMount() {
        if (localStorage.getItem('language') === null) {
            localStorage.setItem('language', '0');
        }
    }

    onChangeInput = (event) => {
        this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };
    openModalLan = () => {
        this.setState({ openModal: true });
    }
    handleOpen = () => {
        localStorage.setItem('language', this.state.language);
        window.location.reload();
        this.setState({
            openModal: false
        });
    };

    handleClose = () => {
        var selectedLan = localStorage.getItem('language');
        this.setState({
            language: selectedLan,
            openModal: false
        });
    };

    render() {
        const { classes } = this.props;
        var isLogin;
        if ((window.location.pathname).indexOf('login') > -1) {
            isLogin = true
        } else {
            isLogin = false
        }
        return (
            <React.Fragment>
                {isLogin && <Button id="fuse-settings" className={classes.button} variant="contained" onClick={this.openModalLan}>
                    <Icon className={classes.buttonIcon}>settings</Icon>
                </Button>}
                <Dialog
                    open={this.state.openModal}
                    TransitionComponent={Transition}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
                >
                    <DialogTitle id="alert-dialog-title">{"Select Language"}</DialogTitle>
                    <div style={{ display: 'flex', marginBottom: 20, marginLeft: 70, marginRight: 70, justifyContent: 'center', maxWidth: '100vw' }}>
                        <Select
                            labelId="demo-customized-select-label"
                            id="demo-customized-select"
                            name="language"
                            value={this.state.language}
                            onChange={this.onChangeInput}
                            input={<BootstrapInput />}
                            style={{ marginRight: 20 }}
                        >
                            <MenuItem value={0}>English</MenuItem>
                            <MenuItem value={1}>Hebrew</MenuItem>
                            <MenuItem value={2}>Arabic</MenuItem>
                        </Select>
                    </div>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Disagree</Button>
                        <Button onClick={this.handleOpen} color="primary" autoFocus>Agree</Button>
                    </DialogActions>
                </Dialog>

            </React.Fragment>
        );
    }
}

export default withStyles(styles)(SettingsPanel);
