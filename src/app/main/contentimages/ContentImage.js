import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TablePagination from '@material-ui/core/TablePagination';
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import './tableStyle.css'
import translations from '../multiLan';

let token;
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
class ContentImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imagesources: [],
            imagesourcesTotal: [],
            rowsPerPage: 10,
            currentPage: 0,
            totalElements: 10,
            openModal: false,
        }
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({
            selectedLan: selectedLan,
        });
    }
    componentDidMount() {
        token = localStorage.getItem('token') || ''
        var article_id = localStorage.getItem('article_id') || ''
        var title = localStorage.getItem('title') || ''
        this.setState({
            article_id: article_id,
            title: title,
        })
        this.uploadImage();
    }


    uploadImage() {
        const options = {
            headers: {
                'x-pos-user-token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const url = `http://165.227.81.153:3005/getdata/articleImages`
        axios.get(
            url,
            options
        )
            .then(res => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                var usersDatas = res.data;
                if (usersDatas.length > 0) {
                    var imagesource_temp = [];
                    let j = 0;
                    for (let i = 0; i < usersDatas.length; i++) {
                        if (usersDatas[i].article_id === this.state.article_id) {
                            imagesource_temp[j] = usersDatas[i].filename;
                            j = j + 1;
                        }
                    }
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
            })
        setTimeout(() => {
            this.getImageSources();
        }, 2000);
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
        const url = 'http://165.227.81.153:3005/getdata/deleteArticleImage';
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        const { imagesource } = this.state;
        axios.post(
            url,
            {
                article_id: this.state.article_id,
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
                                src={"http://165.227.81.153:3005/uploads/articles/" + this.state.article_id + '/' + imagesource}
                                alt="new"
                                height="42" width="42"
                            />
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.handleClickOpen(e, imagesource)}>{translations[this.state.selectedLan]['_DELETE']}</Button>
                        </td>
                    </tr>
                )
            })
        }

    }
    handleChangePage = async (event, page) => {
        this.setState({
            currentPage: page,
        }, () => {
            this.getImageSources();
        })
    }

    handleChangeRowsPerPage = event => {
        const totalElements = this.state;
        const rowsPerPage = event.target.value;
        const currentPage = (rowsPerPage >= totalElements)
            ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
        },
            () => {
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
    onContents(e) {
        let path = `/photographer/contents`;
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
                content={
                    <div className="p-24" dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}>
                        <h1 style={{ textAlign: 'center' }}>{this.state.title}</h1>
                        <br />
                        <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.onContents(e)}><span style={{ color: 'blue', fontSize: 20 }}>{translations[this.state.selectedLan]['_ARTICLES']}</span></Button>
                        <br />
                        <br />
                        <br />
                        <div>
                            <table id='usersDatas'>
                                {(this.state.usersDatas !== []) && <tbody>
                                    <tr>
                                        <th>{translations[this.state.selectedLan]['_NO']}</th>
                                        <th>{translations[this.state.selectedLan]['_FILE_NAME']}</th>
                                        <th>{translations[this.state.selectedLan]['_IMAGE']}</th>
                                        <th>{translations[this.state.selectedLan]['_DELETE_IMAGE']}</th>
                                    </tr>
                                    {this.renderTableData()}
                                </tbody>}
                            </table>
                        </div>
                        <div>
                            <TablePagination
                                dir='ltr'
                                style={ this.state.selectedLan === '0' ? { overflow: 'auto'} : {overflow: 'auto', display:'flex'}}
                                labelRowsPerPage=''
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
                            dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}
                        >
                            <DialogTitle id="alert-dialog-title">{translations[this.state.selectedLan]['_IMAGE_MODAL_DELETE_IMAGE']}</DialogTitle>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    {translations[this.state.selectedLan]['_DISAGREE']}
                                </Button>
                                <Button onClick={this.handleOpen} color="primary" autoFocus>
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
export default withStyles(styles, { withTheme: true })(withRouter(ContentImage));