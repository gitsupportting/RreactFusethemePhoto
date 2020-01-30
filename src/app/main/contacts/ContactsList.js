import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import './tableStyle.css'
// import Popup from "reactjs-popup";
import _ from '@lodash';
import translations from './../../main/multiLan';

let token;
class ContactsList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedContactsMenu: null,
            usersDatas: [],
            data: null,
            fullscreen: false,
            loading: false,
            imageFile: null,
            imageFileName: '',
            show: false,
            openModal: false,
            deleteopenModal: false,
        }
        // this.uploadBtn = React.createRef();
        this.uploadBtn = [];
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.onUserImages = this.onUserImages.bind(this);
        this.deleteClickOpen = this.deleteClickOpen.bind(this);
        this.deleteClose = this.deleteClose.bind(this);
        this.deleteOpen = this.deleteOpen.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({ selectedLan: selectedLan });
    }
    componentDidMount() {
        token = localStorage.getItem('token') || '';
        this.getUsers();
    }
    getUsers() {
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        axios.get(`http://165.227.81.153:3005/getdata/users`, { headers: headers })
            .then(res => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                var usersDatas_temp = res.data;
                var usersDatas = [];
                for (let i = 0; i < usersDatas_temp.length; i++) {
                    if (usersDatas_temp[i].role !== 1) {
                        usersDatas.push(usersDatas_temp[i]);
                    }
                }
                this.setState({
                    usersDatas: usersDatas
                })
            })
    }
    onChangeGalleryName = (event) => {
        this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };

    handleClickOpen(e, user_id) {
        this.setState({
            user_id: user_id,
            openModal: true
        });
    };

    handleClose() {
        this.setState({
            openModal: false
        });
    };
    handleOpen() {
        var min = 10000;
        var max = 99999;
        var userCode = Math.floor(Math.random() * (max - min + 1)) + min;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var startDate = mm + '/' + dd + '/' + yyyy;
        console.log(startDate);
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        axios.post(`http://165.227.81.153:3005/getdata/addExpirationdays`, { user_id: this.state.user_id, ExpirationDays: this.state.ExpirationDays, userCode: userCode, startDate: startDate }, { headers: headers })
            .then(res => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                this.getUsers();
            })
        this.setState({
            ExpirationDays: '',
            openModal: false
        });
    };

    deleteClickOpen(e, user_id) {
        this.setState({
            user_id: user_id,
            deleteopenModal: true
        });
    };

    deleteClose() {
        this.setState({
            deleteopenModal: false
        });
    };
    deleteOpen() {
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        axios.post(`http://165.227.81.153:3005/getdata/deleteUser`, { user_id: this.state.user_id }, { headers: headers })
            .then(res => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                axios.get(`http://165.227.81.153:3005/getdata/users`, { headers: headers })
                    .then(res => {
                        var usersDatas_temp = res.data;
                        var usersDatas = [];
                        for (let i = 0; i < usersDatas_temp.length; i++) {
                            if (usersDatas_temp[i].role !== 1) {
                                usersDatas.push(usersDatas_temp[i]);
                            }
                        }
                        this.setState({
                            usersDatas: usersDatas,
                            deleteopenModal: false,
                        })
                    })
            })
        // this.setState({
        //     deleteopenModal: false
        // });
    };

    onUserImages(e, user_id, user_name) {
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('user_name', user_name);
        let path = `/photographer/galleries`;
        this.props.history.push(path);
    };
    renderTableData() {

        if (this.state.usersDatas !== []) {
            var no = 0;
            return this.state.usersDatas.map((usersData, index) => {
                const { user_id, name, email, startDate, ExpirationDays, userCode } = usersData //destructuring
                no = no + 1;
                return (
                    <tr key={user_id}>
                        <td>{no}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{startDate}</td>
                        <td>{ExpirationDays}</td>
                        <td>{userCode}</td>
                        {/* <td>
                            <div>
                                <label for="image_uploads" onClick={(e) => this.openFileDg(e, index)}>Choose images</label> */}
                        {/* <label for="image_uploads" onClick={this.openFileDg}>Choose images</label> */}
                        {/* <input id="myInput"
                                    type="file"
                                    ref={(ref) => this.uploadBtn[index] = ref}
                                    // ref={(ref) => this.uploadBtn = ref}
                                    style={{ display: 'none' }}
                                    onChange={(e) => this.onChangeFile(e, user_id)}
                                />
                            </div>
                        </td> */}
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.onUserImages(e, user_id, name)}>{translations[this.state.selectedLan]['_VIEW']}</Button>
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.handleClickOpen(e, user_id)}>{translations[this.state.selectedLan]['_GENERATE']}</Button>
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.deleteClickOpen(e, user_id)}>{translations[this.state.selectedLan]['_DELETE']}</Button>
                        </td>
                    </tr>
                )
            })
        }
    }

    render() {
        return (
            <div className="App" dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}>
                <table id='usersDatas'>
                    {(this.state.usersDatas !== []) && <tbody>
                        <tr>
                            <th>{translations[this.state.selectedLan]['_NO']}</th>
                            <th>{translations[this.state.selectedLan]['_NAME']}</th>
                            <th>{translations[this.state.selectedLan]['_EMAIL']}</th>
                            <th>{translations[this.state.selectedLan]['_START_DATE']}</th>
                            <th>{translations[this.state.selectedLan]['_DURATION']}</th>
                            <th>{translations[this.state.selectedLan]['_CODE']}</th>
                            <th>{translations[this.state.selectedLan]['_GALLERIES']}</th>
                            <th>{translations[this.state.selectedLan]['_GENERATE']}</th>
                            <th>{translations[this.state.selectedLan]['_DELETE']}</th>
                        </tr>
                        {this.renderTableData()}
                    </tbody>}
                </table>
                <Dialog
                    open={this.state.openModal}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}
                >
                    <DialogTitle id="alert-dialog-title">{translations[this.state.selectedLan]['_USERS_ADD_EXPIRATION_DATE']}</DialogTitle>
                    <TextField
                        label={translations[this.state.selectedLan]['_USERS_EXPIRATION_DATE']}
                        autoFocus
                        name="ExpirationDays"
                        value={this.state.ExpirationDays}
                        onChange={this.onChangeGalleryName}
                        variant="outlined"
                        required
                        style={{ marginLeft: 20, marginRight: 20 }}
                    />
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            {translations[this.state.selectedLan]['_DISAGREE']}
                        </Button>
                        <Button onClick={this.handleOpen} color="primary" autoFocus>
                            {translations[this.state.selectedLan]['_AGREE']}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.deleteopenModal}
                    onClose={this.deleteClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}
                >
                    <DialogTitle id="alert-dialog-title">{translations[this.state.selectedLan]['_DELETE_USER']}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.deleteClose} color="primary">
                            {translations[this.state.selectedLan]['_DISAGREE']}
                        </Button>
                        <Button onClick={this.deleteOpen} color="primary" autoFocus>
                            {translations[this.state.selectedLan]['_AGREE']}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default (withRouter(ContactsList));



