import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button } from '@material-ui/core';
import translations from './../../main/multiLan';

const styles = theme => ({
    root: {
        '& .logo-icon': {
            width: 24,
            height: 24,
            transition: theme.transitions.create(['width', 'height'], {
                duration: theme.transitions.duration.shortest,
                easing: theme.transitions.easing.easeInOut
            })
        }
    },
    reactBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#61dafb'
    }
});

class Logo extends Component {
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({ selectedLan: selectedLan });
    }
    onLogout(e) {
        localStorage.setItem('token', 'aa');
        let path = `/photographer/login`;
        this.props.history.push(path);
    };
    render() {
        return (
            <div className="flex items-center">
                {/* <div className="flex items-center" dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}> */}
                <br></br>
                <br></br>
                <br></br>
                <img className="logo-icon" src="photographer/assets/images/logos/fuse.svg" alt="logo" height="20" width="20" />
                <Button onClick={(e) => this.onLogout(e)}><span style={{ marginLeft: '18px' }}>{translations[this.state.selectedLan]['_LOGOUT']}</span></Button>
            </div>
        );
    }
}
export default (withRouter(withStyles(styles, { withTheme: true })(Logo)));

