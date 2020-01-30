import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from '@lodash';
import { withRouter } from 'react-router-dom';
import translations from './../../../main/multiLan';
const styles = theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color: theme.palette.primary.contrastText
    }
});

class LoginPage extends Component {

    state = {
        email: '',
        password: '',
        remember: true,
    };
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({ selectedLan: selectedLan });
    }
    componentDidMount() {
    };
    getTranslation = (lang, text) => {
        return translations[lang][text];
    }

    handleChange = (event) => {
        this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };

    canBeSubmitted() {
        const { email, password } = this.state;
        return (
            email.length > 0 && password.length > 0
        );
    }
    onLogin = () => {

        axios.post(`http://165.227.81.153:3005/users/adminlogin`, { email: this.state.email, password: this.state.password })
            .then(res => {
                if (res.data.data.token !== undefined) {
                    localStorage.setItem('token', res.data.data.token);
                    let path = `/photographer/apps/contacts/all`;
                    this.props.history.push(path);
                }
            })
    };
    render() {
        const { classes } = this.props;
        const { email, password } = this.state;

        return (
            <div className={classNames(classes.root, "flex flex-col flex-auto flex-no-shrink items-center justify-center p-32")} dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}>

                <div className="flex flex-col items-center justify-center w-full">

                    <FuseAnimate animation="transition.expandIn">

                        {/* <Card style="visibility: visible;opacity: 1;transform-origin: 50% 50% 0px;transform: scaleX(1) scaleY(1);width: auto;"> */}
                        <Card >

                            <CardContent className="flex flex-col items-center justify-center p-32">

                                {/* <img className="w-128 m-32" src="assets/images/logos/fuse.svg" alt="logo" /> */}

                                <Typography variant="h6" className="mt-16 mb-32">
                                    {
                                        translations[this.state.selectedLan]['_LOGIN_TO_YOUR_ACCOUNT']
                                    }
                                </Typography>

                                <form name="loginForm" noValidate className="flex flex-col justify-center w-full">

                                    <TextField
                                        className="mb-16"
                                        label={
                                            translations[this.state.selectedLan]['_EMAIL']
                                        }
                                        autoFocus
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
                                        label={
                                            translations[this.state.selectedLan]['_PASSWORD']
                                        }
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleChange}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                    <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                        disabled={!this.canBeSubmitted()} onClick={this.onLogin.bind(this)}>
                                        {
                                            translations[this.state.selectedLan]['_LOGIN']
                                        }
                                    </Button>
                                </form>

                                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                    <span className="font-medium">Don't have an account?</span>
                                    <Link className="font-medium" to="/photographer/register">
                                        {
                                            translations[this.state.selectedLan]['_CREATE_AN_ACCOUNT']
                                        }
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </FuseAnimate>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(LoginPage));
