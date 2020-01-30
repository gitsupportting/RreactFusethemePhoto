import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import { Link } from 'react-router-dom';
import axios from 'axios'
import _ from '@lodash';
import { withRouter } from 'react-router-dom';
// import translations from '../../../main/multiLan';
import translations from './../../../main/multiLan';

const styles = theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color: theme.palette.primary.contrastText
    }
});

class RegisterPage extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        acceptTermsConditions: false
    };
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({ selectedLan: selectedLan });
    }
    handleChange = (event) => {
        this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };
    onSignin = () => {
        let that = this;
        axios.post(`http://165.227.81.153:3005/users/signup`, { name: this.state.name, email: this.state.email, password: this.state.password, role: 1, })
            .then(res => {
                console.log(res.data.result);
                if (res.data.result) {
                    // let path = "/login";
                    let path = "/photographer/login";
                    that.props.history.push(path);
                }
            })
    };
    canBeSubmitted() {
        const { email, password, passwordConfirm, acceptTermsConditions } = this.state;
        return (
            email.length > 0 &&
            password.length > 0 &&
            password.length > 3 &&
            password === passwordConfirm &&
            acceptTermsConditions
        );
    }

    render() {
        // const { classes } = this.props;
        const { name, email, password, passwordConfirm, acceptTermsConditions } = this.state;

        return (
            // <div className={classNames(classes.root, "flex flex-col flex-auto flex-no-shrink items-center justify-center p-32")}>

            <div className="flex flex-col items-center justify-center w-full" dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}>

                <FuseAnimate animation="transition.expandIn">

                    <Card className="w-full max-w-384">

                        <CardContent className="flex flex-col items-center justify-center p-32">

                            {/* <img className="w-128 m-32" src="assets/images/logos/fuse.svg" alt="logo" /> */}

                            <Typography variant="h6" className="mt-16 mb-32">{translations[this.state.selectedLan]['_CREATE_AN_ACCOUNT_R']}</Typography>

                            <form name="registerForm" noValidate className="flex flex-col justify-center w-full">

                                <TextField
                                    className="mb-16"
                                    label={translations[this.state.selectedLan]['_NAME']}
                                    autoFocus
                                    type="name"
                                    name="name"
                                    value={name}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />

                                <TextField
                                    className="mb-16"
                                    label={translations[this.state.selectedLan]['_EMAIL']}
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />

                                <TextField
                                    className="mb-16"
                                    label={translations[this.state.selectedLan]['_PASSWORD']}
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />

                                <TextField
                                    className="mb-16"
                                    label={translations[this.state.selectedLan]['_PASSWORD_CONFIRM']}
                                    type="password"
                                    name="passwordConfirm"
                                    value={passwordConfirm}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />

                                <FormControl className="items-center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="acceptTermsConditions"
                                                checked={acceptTermsConditions}
                                                onChange={this.handleChange} />
                                        }
                                        label={translations[this.state.selectedLan]['_CONDITIONS']}
                                    />
                                </FormControl>


                                <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="Register"
                                    disabled={!this.canBeSubmitted()} onClick={this.onSignin}>
                                    {translations[this.state.selectedLan]['_CREATE_AN_ACCOUNT_R']}
                                    </Button>

                            </form>

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <span className="font-medium">Already have an account?</span>
                                    <Link className="font-medium" to="/photographer/login">{translations[this.state.selectedLan]['_LOGIN_R']}</Link>
                                {/* <Link className="font-medium" to="/login">Login</Link> */}
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimate>
            </div>
            // </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(RegisterPage));
