import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { TextField, Button, DialogContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
// import TablePagination from '@material-ui/core/TablePagination';
import { withRouter } from 'react-router-dom';
import translations from './../../main/multiLan';
import axios from 'axios'
import './tableStyle.css'
import _ from '@lodash';
let token
var user_id, user_name;
const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});
class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedContactsMenu: null,
            data: null,
            fullscreen: false,
            loading: false,
            AddGalleryName: '',
            GalleryNames: [],
            GalleryIds: [],
            DeleteGalleryName: '',
            EditGalleryName: '',
            rowsPerPage: 10,
            currentPage: 0,
            totalElements: 10,
            openModal: false,
            editModal: false,
            open: true,
        }
        this.onUserImages = this.onUserImages.bind(this);
        this.onAddGalleries = this.onAddGalleries.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.editClose = this.editClose.bind(this);
        this.editOpen = this.editOpen.bind(this);
    }
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({ selectedLan: selectedLan });
    }
    componentDidMount() {
        user_id = localStorage.getItem('user_id') || ''
        user_name = localStorage.getItem('user_name') || ''
        this.getGalleries();
    }

    getGalleries() {
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        axios.post(`http://165.227.81.153:3005/getdata/galleries`, { user_id: user_id, }, { headers: headers })
            .then(res => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                var GalleryNames_temp = res.data;
                var GalleryNames = [];
                var GalleryIds = [];
                for (let i = 0; i < GalleryNames_temp.length; i++) {
                    GalleryNames[i] = GalleryNames_temp[i].GalleryName;
                    GalleryIds[i] = GalleryNames_temp[i].gallery_id;
                }
                this.setState({
                    GalleryNames: GalleryNames,
                    GalleryIds: GalleryIds,
                    GalleryName: GalleryNames[0],
                })
            })
    }

    handleClickOpen(e, GalleryName) {
        this.setState({
            DeleteGalleryName: GalleryName,
            openModal: true
        });
    };

    handleClose() {
        this.setState({
            openModal: false
        });
    };
    handleOpen() {
        var GalleryId_temp = '';
        for (let i = 0; i < (this.state.GalleryIds).length; i++) {
            if ((this.state.GalleryNames)[i] === this.state.DeleteGalleryName) {
                GalleryId_temp = (this.state.GalleryIds)[i];
                break;
            }
        }
        const url = 'http://165.227.81.153:3005/getdata/deleteFolder';
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        axios.post(
            url,
            {
                user_id: user_id,
                gallery_id: GalleryId_temp,
                GalleryName: this.state.DeleteGalleryName,
            },
            { headers: headers }
        )
            .then((res) => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                this.getGalleries();
                this.setState({
                    DeleteGalleryName: '',
                })
            })

        this.setState({
            openModal: false
        });
    };
    editClickOpen(e, GalleryName) {
        this.setState({
            GalleryName: GalleryName,
            editModal: true
        });
    };

    editClose() {
        this.setState({
            editModal: false
        });
    };
    editOpen(event, EditGalleryName) {
        this.setState({
            EditGalleryName: EditGalleryName,
        }, () => {
            const url = 'http://165.227.81.153:3005/getdata/editGallery';
            token = localStorage.getItem('token') || ''
            const headers = {
                'Content-Type': 'application/json',
                'x-pos-user-token': token
            }
            axios.post(
                url,
                {
                    user_id: user_id,
                    GalleryName: this.state.GalleryName,
                    EditGalleryName: this.state.EditGalleryName,
                },
                { headers: headers }
            )
                .then((res) => {
                    if (res.data === 'Invalid token') {
                        let path = `/photographer/login`;
                        this.props.history.push(path);
                    }
                    this.getGalleries();
                    this.setState({
                        GalleryName: '',
                        EditGalleryName: '',
                    })
                })
        })
        this.setState({
            editModal: false
        });
    };
    onAddGalleries(e, user_id) {

        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        if (this.state.AddGalleryName !== '') {
            axios.post(`http://165.227.81.153:3005/getdata/addGalleries`, { GalleryName: this.state.AddGalleryName, user_id: user_id, }, { headers: headers })
                .then(res => {
                    if (res.data === 'Invalid token') {
                        let path = `/photographer/login`;
                        this.props.history.push(path);
                    }
                    axios.post(`http://165.227.81.153:3005/getdata/galleries`, { user_id: user_id, }, { headers: headers })
                        .then(ress => {
                            var GalleryNames_temp = ress.data;
                            var GalleryNames = [];
                            var GalleryIds = [];
                            for (let i = 0; i < GalleryNames_temp.length; i++) {
                                GalleryNames[i] = GalleryNames_temp[i].GalleryName;
                                GalleryIds[i] = GalleryNames_temp[i].gallery_id;
                            }
                            if (GalleryNames.length === 1) {
                                this.setState({
                                    GalleryName: GalleryNames[0],
                                    gallery_id: GalleryIds[0],
                                })
                            }
                            this.setState({
                                GalleryNames: GalleryNames,
                                GalleryIds: GalleryIds,
                                AddGalleryName: '',
                                // GalleryName: GalleryNames[GalleryNames_temp.length -1],
                                // gallery_id: GalleryIds[GalleryNames_temp.length -1]
                            }, () => {
                                // console.log(this.state.GalleryNames)
                            })
                        })
                })
        }
    }

    onChangeGalleryName = (event) => {
        this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    };

    renderTableData() {
        // {GalleryNames.map(GalleryName => (
        if (this.state.GalleryNames !== []) {
            var no = 0;
            return this.state.GalleryNames.map((GalleryName, index) => {
                no = no + 1;
                return (
                    <tr key={index}>
                        <td>{no}</td>
                        <td>{GalleryName}</td>
                <td><Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.onUserImages(e, GalleryName)}>{translations[this.state.selectedLan]['_VIEW']}</Button></td>
                        <td>
                <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.handleClickOpen(e, GalleryName)}>{translations[this.state.selectedLan]['_DELETE']}</Button>
                        </td>
                        <td>
                <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.editClickOpen(e, GalleryName)}>{translations[this.state.selectedLan]['_EDIT']}</Button>
                        </td>
                    </tr>
                )
            })
        }
    }
    handleChangePage = async (event, page) => {
        this.setState({
            // isBusyForLoadingProjects: false,
            currentPage: page,
        }, () => {
            this.getImageSources();
        })
    }

    handleChangeRowsPerPage = event => {
        // const { projects } = this.props;
        const totalElements = this.state;
        const rowsPerPage = event.target.value;
        const currentPage = (rowsPerPage >= totalElements)
            ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
        },
            () => {
                // this.handleChangePage(null, 0);
                this.getImageSources();
            });
    };
    getImageSources = () => {
        const { currentPage, rowsPerPage } = this.state;
        var imagesource_temp = [];
        for (let i = currentPage * rowsPerPage; i < (currentPage + 1) * rowsPerPage; i++) {
            if ((this.state.imagesourcesTotal)[i] !== undefined) {
                imagesource_temp[i - currentPage * rowsPerPage] = (this.state.imagesourcesTotal)[i];
            }
        }
        this.setState({
            imagesources: imagesource_temp,
        });
    }
    onUserImages(e, GalleryName) {
        var GalleryId_temp = '';
        for (let i = 0; i < (this.state.GalleryIds).length; i++) {
            if ((this.state.GalleryNames)[i] === GalleryName) {
                GalleryId_temp = (this.state.GalleryIds)[i];
                break;
            }
        }
        localStorage.setItem('gallery_id', GalleryId_temp);
        localStorage.setItem('GalleryName', GalleryName);
        let path = `/photographer/images`;
        setTimeout(() => {
            this.props.history.push(path);
        }, 300);
    };
    onUsers(e) {
        let path = `/photographer/apps/contacts/all`;
        this.props.history.push(path);
    };

    render() {
        const { classes } = this.props;
        // const { GalleryNames } = this.state;
        // const { currentPage, rowsPerPage, totalElements } = this.state;
        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                // header={
                //     <h4>{this.state.user_name}</h4>
                //     }
                content={
                    <div className="p-24" dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}>
                        <h1 style={{ textAlign: 'center' }}>{user_name}</h1>
                        <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.onUsers(e)}><span style={{ color: 'blue', fontSize: 20 }}>{translations[this.state.selectedLan]['_USERS']}</span></Button>
                        <br />
                        <div style={{ marginTop: 15, textAlign: 'right' }}>
                            <TextField
                                label={translations[this.state.selectedLan]['_GALLERY_NAME']}
                                autoFocus
                                name="AddGalleryName"
                                value={this.state.AddGalleryName}
                                onChange={this.onChangeGalleryName}
                                variant="outlined"
                                required
                                style={{ marginLeft: 20, marginRight: 20 }}
                            />
                            <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                onClick={(e) => this.onAddGalleries(e, user_id)} style={{ marginLeft: 20, marginRight: 20 }}>
                                {translations[this.state.selectedLan]['_ADD_GALLERY']}
                            </Button>
                        </div>
                        <br />
                        <div>
                            <table id='usersDatas'>
                                {(this.state.usersDatas !== []) && <tbody>
                                    <tr>
                                        <th>{translations[this.state.selectedLan]['_NO']}</th>
                                        <th>{translations[this.state.selectedLan]['_GALLERY_NAME']}</th>
                                        <th>{translations[this.state.selectedLan]['_VIEW']}</th>
                                        <th>{translations[this.state.selectedLan]['_EDIT_GALLERY']}</th>
                                        <th>{translations[this.state.selectedLan]['_DELETE_GALLERY']}</th>
                                    </tr>
                                    {this.renderTableData()}
                                </tbody>}
                            </table>
                        </div>
                        {/* <div>
                            <TablePagination
                                style={{ overflow: 'auto' }}
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={totalElements}
                                rowsPerPage={rowsPerPage}
                                page={currentPage}
                                backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                                nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div> */}
                        <Dialog
                            open={this.state.openModal}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}
                        >
                            <DialogTitle id="alert-dialog-title">{translations[this.state.selectedLan]['GALLERY_MODAL_DELETE']}</DialogTitle>
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
                            open={this.state.editModal}
                            onClose={this.editClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}
                        >
                            <DialogTitle id="alert-dialog-title">{translations[this.state.selectedLan]['GALLERY_MODAL_EDIT']}</DialogTitle>
                            <DialogContent classes={{ root: "p-16 pb-0 sm:p-24 sm:pb-0" }}>
                                <TextField
                                    label={translations[this.state.selectedLan]['_GALLERY_NAME']}
                                    autoFocus
                                    name="EditGalleryName"
                                    value={this.state.EditGalleryName}
                                    onChange={this.onChangeGalleryName}
                                    variant="outlined"
                                    required
                                    style={{ marginLeft: 20, marginRight: 20 }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.editClose} color="primary">
                                {translations[this.state.selectedLan]['_DISAGREE']}
                                </Button>
                                <Button onClick={(event) => this.editOpen(event, this.state.EditGalleryName)} color="primary" autoFocus>
                                {translations[this.state.selectedLan]['_AGREE']}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div >
                }
            />
        )
    }
}
// export default (withRouter(Example));
// export default (withRouter(withStyles(styles, {withTheme: true })(Example)));
export default withStyles(styles, { withTheme: true })(withRouter(Gallery));