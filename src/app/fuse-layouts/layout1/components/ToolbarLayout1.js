import React from 'react';
import { AppBar, MuiThemeProvider, Toolbar, withStyles } from '@material-ui/core';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import translations from './../../../main/multiLan';
const styles = theme => ({
    separator: {
        width: 1,
        height: 64,
        backgroundColor: theme.palette.divider
    }
});

const ToolbarLayout1 = ({ classes, settings, toolbarTheme }) => {

    if (localStorage.getItem('language') === null || localStorage.getItem('language') === undefined || localStorage.getItem('language') === '') {
        localStorage.setItem('language', '0');
    }   

    return (
        <MuiThemeProvider theme={toolbarTheme}>
            <AppBar id="fuse-toolbar" className="flex relative z-10" color="default">
                <Toolbar className="p-0">
                    <h1 id='title' style={{ flex: 'auto' }}>{translations[localStorage.getItem('language')]['_PHOTOGRAPHER']}</h1>
                </Toolbar>
            </AppBar>
        </MuiThemeProvider>
    );
};

function mapStateToProps({ fuse }) {
    return {
        settings: fuse.settings.current,
        toolbarTheme: fuse.settings.toolbarTheme
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps)(ToolbarLayout1)));
