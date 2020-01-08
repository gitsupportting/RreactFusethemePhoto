import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from '@lodash';
import { withRouter } from 'react-router-dom';
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
        IsAdmin: true,
    };
    componentDidMount() {
        localStorage.setItem('Islogged', false);

        // localStorage.getItem('token');
        // let token = localStorage.getItem('token') || ''
        // var postData = {
        //     user_id: 'userid'
        //   };

        //   let axiosConfig = {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'x-pos-user-token': token,
        //     }
        //   };

        //   axios.post('http://localhost:3000/files/', postData, axiosConfig)
        //   .then((res) => {
        //     console.log("RESPONSE RECEIVED: ", res);
        //   })
        //   .catch((err) => {
        //     console.log("AXIOS ERROR: ", err);
        //   })

    };


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
        localStorage.setItem('Islogged', true);
        axios.post(`http://localhost:3000/users/adminlogin`, { email: this.state.email, password: this.state.password })
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
            <div className={classNames(classes.root, "flex flex-col flex-auto flex-no-shrink items-center justify-center p-32")}>

                <div className="flex flex-col items-center justify-center w-full">

                    <FuseAnimate animation="transition.expandIn">

                        {/* <Card style="visibility: visible;opacity: 1;transform-origin: 50% 50% 0px;transform: scaleX(1) scaleY(1);width: auto;"> */}
                        <Card >

                            <CardContent className="flex flex-col items-center justify-center p-32">

                                {/* <img className="w-128 m-32" src="assets/images/logos/fuse.svg" alt="logo" /> */}

                                <Typography variant="h6" className="mt-16 mb-32">LOGIN TO YOUR ACCOUNT</Typography>

                                <form name="loginForm" noValidate className="flex flex-col justify-center w-full">

                                    <TextField
                                        className="mb-16"
                                        label="Email"
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
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleChange}
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />

                                    {/* <div className="flex items-center justify-between">

                                        <FormControl>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="remember"
                                                        checked={remember}
                                                        onChange={this.handleChange}/>
                                                }
                                                label="Remember Me"
                                            />
                                        </FormControl>

                                        <Link className="font-medium" to="/pages/auth/forgot-password">
                                            Forgot Password?
                                        </Link>
                                    </div> */}
                                    {this.state.IsAdmin === false && <h4 style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>Login with admin</h4>}
                                    <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                        disabled={!this.canBeSubmitted()} onClick={this.onLogin.bind(this)}>
                                        LOGIN
                                    </Button>

                                </form>

                                {/* <div className="my-24 flex items-center justify-center">
                                    <Divider className="w-32"/>
                                    <span className="mx-8 font-bold">OR</span>
                                    <Divider className="w-32"/>
                                </div> */}

                                {/* <Button variant="contained" color="secondary" size="small"
                                        className="normal-case w-192 mb-8">
                                    Log in with Google
                                </Button>

                                <Button variant="contained" color="primary" size="small"
                                        className="normal-case w-192">
                                    Log in with Facebook
                                </Button> */}

                                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                    <span className="font-medium">Don't have an account?</span>
                                    <Link className="font-medium" to="/photographer/register">Create an account</Link>
                                    {/* <Link className="font-medium" to="/register">Create an account</Link> */}
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
