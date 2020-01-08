import React, { Component } from 'react'
import { withStyles } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import JWTLoginTab from './tabs/JWTLoginTab';
// import FirebaseLoginTab from './tabs/FirebaseLoginTab';
// import Auth0LoginTab from './tabs/Auth0LoginTab';
// import axios from 'axios';
// let token;
const styles = theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: theme.palette.primary.contrastText
    }
});
// var usersDatas = [];
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { tabValue: 0 };
    }
    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    render() {
        const { classes } = this.props;
        const { tabValue } = this.state;

        return (
            <div className={classNames(classes.root, "flex flex-col flex-1 flex-no-shrink p-24 md:flex-row md:p-0")}>

               
                <FuseAnimate animation={{ translateX: [0, '100%'] }}>

                    {/* <Card className="w-full max-w-400 mx-auto" square> */}

                        {/* <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 "> */}

                            {/* <Typography variant="h6" className="text-center md:w-full mb-48">LOGIN TO YOUR ACCOUNT</Typography> */}

                            {/* <Tabs
                                value={tabValue}
                                onChange={this.handleTabChange}
                                variant="fullWidth"
                                className="mb-32"
                            >
                                <Tab
                                    icon={<img className="h-40 p-4 bg-black rounded-12" src="assets/images/logos/jwt.svg" alt="firebase"/>}
                                    className="min-w-0"
                                    label="JWT"
                                />
                                <Tab
                                    icon={<img className="h-40" src="assets/images/logos/firebase.svg" alt="firebase"/>}
                                    className="min-w-0"
                                    label="Firebase"
                                />
                                <Tab
                                    icon={<img className="h-40" src="assets/images/logos/auth0.svg" alt="auth0"/>}
                                    className="min-w-0"
                                    label="Auth0"
                                />
                            </Tabs> */}

                            {tabValue === 0 && <JWTLoginTab />}
                            {/* {tabValue === 1 && <FirebaseLoginTab/>}
                            {tabValue === 2 && <Auth0LoginTab/>} */}

                            {/* <div className="flex flex-col items-center justify-center pt-32">
                                <span className="font-medium">Don't have an account?</span>
                                <Link className="font-medium" to="/register">Create an account</Link>
                                <Link className="font-medium mt-8" to="/">Back to Dashboard</Link>
                            </div> */}

                        {/* </CardContent> */}
                    {/* </Card> */}
                </FuseAnimate>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(Login));
