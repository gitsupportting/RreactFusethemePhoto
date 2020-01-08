import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import './tableStyle.css'

let token;
var user_id, user_name;
var GalleryName, gallery_id;
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
class Image extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedContactsMenu: null,
            data: null,
            fullscreen: false,
            loading: false,
            imageFile: null,
            imageFileName: '',
            Islogged: false,
            imagesources: [],
            imagesourcesTotal: [],
            AddGalleryName: '',
            GalleryNames: [],
            GalleryIds: [],
            DeleteGalleryName: '',
            rowsPerPage: 10,
            currentPage: 0,
            totalElements: 10,
            openModal: false,
            open: true,
            isUploaded: true,
        }
        // this.uploadBtn = React.createRef();
        //
        this.openFileDg = this.openFileDg.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }
    componentDidMount() {
        user_id = localStorage.getItem('user_id') || ''
        user_name = localStorage.getItem('user_name') || ''
        GalleryName = localStorage.getItem('GalleryName') || ''
        gallery_id = localStorage.getItem('gallery_id') || ''
        this.setState({
            GalleryName: GalleryName,
            gallery_id: gallery_id,
            user_name: user_name,
        })
        token = localStorage.getItem('token') || ''
        this.uploadImage();
    }


    uploadImage() {
        const options = {
            headers: {
                'x-pos-user-token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const url = `http://localhost:3000/files/images`
        axios.get(
            url,
            options
        )
            .then(res => {
                var usersDatas = res.data;
                if (usersDatas.length > 0) {
                    var imagesource_temp = [];
                    let j=0;
                    for (let i = 0; i < usersDatas.length; i++) {
                        if ((usersDatas[i].user_id === user_id) && (usersDatas[i].gallery_id === this.state.gallery_id)) {
                            imagesource_temp[j] = usersDatas[i].filename;
                            j=j+1;
                        }
                    }
                    console.log(user_id);
                    console.log(this.state.gallery_id)
                    console.log(imagesource_temp);
                    if (imagesource_temp.length > 0) {
                        this.setState({
                            imagesourcesTotal: imagesource_temp,
                            totalElements: imagesource_temp.length,
                        });
                    } else {
                        this.setState({
                            imagesourcesTotal: [],
                        })
                    }
                } else {
                    this.setState({
                        imagesourcesTotal: []
                    })
                }
                this.setState({
                    isUploaded: true,
                })
            })
        setTimeout(() => {
            this.getImageSources();
        }, 2000);
    }

    openFileDg(e) {
        this.uploadBtn.click();
    }

    onChangeFile(e, user_id) {
        this.setState({
            isUploaded: false,
        })
        for (let i = 0; i < (e.target.files).length; i++) {
            let imageFile = e.target.files[i];
            let imageFileName = e.target.files[i].name;
            let formdata = new FormData();
            formdata.set('user_id', user_id);
            formdata.set('GalleryName', this.state.GalleryName);
            formdata.set('gallery_id', this.state.gallery_id);
            formdata.append('file', imageFile);
            const url = 'http://localhost:3000/files/' + imageFileName;
            const options = {
                headers: {
                    'x-pos-user-token': token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            axios.post(
                url,
                formdata,
                options
            )
                .then((response) => {
                    this.uploadImage();
                })
        }
    }

    handleClickOpen(e, imagesource) {
        this.setState({
            imagesource: imagesource,
            openModal: true
        });
    };

    handleClose() {
        this.setState({
            openModal: false
        });
    };
    handleOpen() {
        const url = 'http://localhost:3000/getdata/deleteImage';
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        const { imagesource } = this.state;
        axios.post(
            url,
            {
                user_id: user_id,
                GalleryName: this.state.GalleryName,
                gallery_id: this.state.gallery_id,
                filename: imagesource,
            },
            { headers: headers }
        )
            .then((res) => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                this.uploadImage();
            })

        this.setState({
            openModal: false
        });
    };


    renderTableData() {

        if (this.state.imagesources !== []) {
            var no = (this.state.currentPage) * (this.state.rowsPerPage);
            return this.state.imagesources.map((imagesource, index) => {
                no = no + 1;
                return (
                    <tr key={index}>
                        <td>{no}</td>
                        <td>{imagesource}</td>
                        <td>
                            <img
                                src={"http://localhost:3000/uploads/" + user_id + '/' + this.state.gallery_id + '/' + imagesource}
                                alt="new"
                                height="42" width="42"
                            />
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.handleClickOpen(e, imagesource)}>Delete</Button>
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
    onUsers(e) {
        let path = `/photographer/apps/contacts/all`;
        this.props.history.push(path);
    };
    onGalleries(e) {
        let path = `/photographer/galleries`;
        this.props.history.push(path);
    };
    render() {
        const { classes } = this.props;
        const { currentPage, rowsPerPage, totalElements } = this.state;

        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                // header={
                // <div className="p-24"><h1>{this.state.user_name} {this.state.GalleryName}</h1></div>
                // }
                // contentToolbar={
                //     <div className="px-24"><h4>{this.state.user_name} {this.state.GalleryName}</h4></div>
                // }
                content={
                    <div className="p-24">
                        <h1 style={{ textAlign: 'center' }}>{this.state.user_name}>{this.state.GalleryName}</h1>
                        <br />
                        <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.onUsers(e)}><span style={{ color: 'blue', fontSize:20 }}>Users/ </span></Button>
                        <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.onGalleries(e)}><span style={{ color: 'blue', fontSize:20 }}>Galleries</span></Button>
                        <br />
                        <div style={{ marginTop: 15, textAlign:'right' }}>
                            <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                onClick={(e) => this.openFileDg(e)} style={{ marginLeft: 20, marginRight: 20 }}>
                                Add Images
                                    </Button>
                            <input id="myInput"
                                type="file"
                                ref={(ref) => this.uploadBtn = ref}
                                multiple
                                // ref={(ref) => this.uploadBtn = ref}
                                style={{ display: 'none' }}
                                onChange={(e) => this.onChangeFile(e, user_id)}
                            />
                        </div>
                        <br />
                        <br />
                        {/* <DemoContent/> */}
                        <div>
                            <table id='usersDatas'>
                                {(this.state.usersDatas !== []) && this.state.isUploaded && <tbody>
                                    <tr>
                                        <th>No</th>
                                        <th>FileName</th>
                                        <th>Image</th>
                                        <th>Delete Image</th>
                                    </tr>
                                    {this.renderTableData()}
                                </tbody>}
                                {!this.state.isUploaded && <CircularProgress disableShrink />}
                            </table>
                        </div>
                        <div>
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
                        </div>
                        <Dialog
                            open={this.state.openModal}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Are you sure want to delete this image?"}</DialogTitle>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Disagree
                                </Button>
                                <Button onClick={this.handleOpen} color="primary" autoFocus>
                                    Agree
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
export default withStyles(styles, { withTheme: true })(withRouter(Image));