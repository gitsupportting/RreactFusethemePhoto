import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { TextField, Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { withRouter } from 'react-router-dom';
import _ from '@lodash';
import axios from 'axios'
import './tableStyle.css'
import translations from './../../main/multiLan';
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
    // paper: {
    //     // padding: theme.spacing(2),
    //     // textAlign: 'center',
    //     // color: theme.palette.text.secondary,
    //     // backgroundColor:'#fafafa',
    //     background:'#fafafa',
    //     backgroundColor:'red'
    // },
});
class Content extends Component {
    constructor(props) {
        super(props);
        this.modules = {
            toolbar: [
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        };

        this.formats = [
            'font',
            'size',
            'bold', 'italic', 'underline',
            'list', 'bullet',
            'align',
            'color', 'background'
        ];
        this.state = {
            selectedContactsMenu: null,
            data: null,
            fullscreen: false,
            loading: false,
            mainImageFile: null,
            tempFile: null,
            mainImage: '',
            Islogged: false,
            imagesources: [],
            articleDataTotal: [],
            AddGalleryName: '',
            GalleryNames: [],
            GalleryIds: [],
            DeleteGalleryName: '',
            rowsPerPage: 10,
            currentPage: 0,
            totalElements: 10,
            openModal: false,
            editArticle: false,
            openModalDeleteArticle: false,
            article_id: '',
            open: true,
            isUploaded: true,
            content: '',
            status_b: 0,
            sticky: 0,

        }

        this.openFileDg = this.openFileDg.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.editClose = this.editClose.bind(this);
        this.editOpen = this.editOpen.bind(this);
        this.deleteClose = this.deleteClose.bind(this);
        this.deleteOpen = this.deleteOpen.bind(this);
        this.rteChange = this.rteChange.bind(this);
    }
    onChangeInput = (event) => {
        this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
        console.log(this.state.dateTime);
        console.log('aaa');
    };
    rteChange = (content, delta, source, editor) => {
        // console.log(editor.getHTML()); // HTML/rich text
        this.setState({ content: editor.getHTML() })
        // console.log(editor.getText()); // plain text
        // console.log(editor.getLength()); // number of characters
    }
    componentWillMount() {
        var selectedLan = localStorage.getItem('language');
        this.setState({ selectedLan: selectedLan });
    }
    componentDidMount() {

        token = localStorage.getItem('token') || ''
        this.getArticleAll();
        this.getCurrentDate();
        // setTimeout(() => {
        //     window.location.reload();
        // }, 10);
    }

    getCurrentDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        this.setState({
            dateTime: today,
        })
    }
    getArticleAll() {
        const options = {
            headers: {
                'x-pos-user-token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const url = `http://165.227.81.153:3005/getdata/articles`
        axios.get(
            url,
            options
        )
            .then(res => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                var articleData = res.data;
                if (articleData.length > 0) {
                    this.setState({
                        articleDataTotal: articleData,
                        totalElements: articleData.length,
                    });
                } else {
                    this.setState({
                        articleDataTotal: [],
                    })
                }
                this.setState({
                    isUploaded: true,
                })
            })
        setTimeout(() => {
            this.getArticleSources();
        }, 2000);
    }

    openFileDg(e) {
        this.uploadBtn.click();
    }

    onChangeFile(e) {
        let mainImageFile = e.target.files[0];
        let mainImage = e.target.files[0].name;
        this.setState({
            tempFile: URL.createObjectURL(e.target.files[0]),
            mainImage: mainImage,
            mainImageFile: mainImageFile
        })
    }
    openFileDgArticle(e, article_id) {
        this.setState({
            article_id: article_id,
        })
        this.uploadBtnArticle.click();
    }
    onChangeFileArticle(e) {
        for (let i = 0; i < (e.target.files).length; i++) {
            let imageFile = e.target.files[i];
            let imageFileName = e.target.files[i].name;
            let formdata = new FormData();
            formdata.set('article_id', this.state.article_id);
            formdata.append('file', imageFile);
            const url = 'http://165.227.81.153:3005/files/otherarticleimg/' + imageFileName;
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
                    if (response.data === 'Invalid token') {
                        let path = `/photographer/login`;
                        this.props.history.push(path);
                    }
                })
        }
    }
    handleClickOpen(e, articleData) {
        this.setState({
            articleData: articleData,
            openModal: true
        });
    };

    handleClose() {
        this.setState({
            openModal: false
        });
    };

    handleOpen() {
        console.log(this.state.status_b);
        let formdata = new FormData();
        formdata.set('title', this.state.title);
        formdata.set('content', this.state.content);
        formdata.set('status_b', this.state.status_b);
        formdata.set('sticky', this.state.sticky);
        formdata.set('dateTime', this.state.dateTime);
        formdata.set('mainImage', this.state.mainImage);
        formdata.append('file', this.state.mainImageFile);
        const url = 'http://165.227.81.153:3005/getdata/addarticle/' + this.state.mainImage;
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
                this.getArticleAll()
                this.setState({
                    openModal: false,
                    title: '',
                    content: '',
                    status_b: false,
                    sticky: false,
                    dateTime: this.state.dateTime,
                    mainImage: '',
                    mainImageFile: null,
                    tempFile: null,
                });
            })
    };
    deleteClickOpen(e, imagesource) {
        this.setState({
            imagesource: imagesource,
            openModalDeleteArticle: true
        });
    };
    deleteClose() {
        this.setState({
            openModalDeleteArticle: false
        });
    };
    deleteOpen() {
        const { imagesource } = this.state;
        var article_id = imagesource.article_id;
        var mainImage = imagesource.mainImage;
        const url = 'http://165.227.81.153:3005/getdata/deleteArticle';
        token = localStorage.getItem('token') || ''
        const headers = {
            'Content-Type': 'application/json',
            'x-pos-user-token': token
        }
        axios.post(
            url,
            {
                article_id: article_id,
                filename: mainImage,
            },
            { headers: headers }
        )
            .then((res) => {
                if (res.data === 'Invalid token') {
                    let path = `/photographer/login`;
                    this.props.history.push(path);
                }
                this.getArticleAll();
            })

        this.setState({
            openModalDeleteArticle: false
        });
    };
    editClickOpen(e, imagesource) {
        this.setState({
            article_id: imagesource.article_id,
            title: imagesource.title,
            content: imagesource.content,
            status_b: imagesource.status_b,
            sticky: imagesource.sticky,
            dateTime: imagesource.dateTime,
            mainImage: imagesource.mainImage,
            editArticle: true,
            openModal: false,
        });
    };
    editClose() {
        this.setState({
            editArticle: false
        });
    };

    editOpen() {
        let formdata = new FormData();
        formdata.set('article_id', this.state.article_id);
        formdata.set('title', this.state.title);
        formdata.set('content', this.state.content);
        formdata.set('status_b', this.state.status_b);
        formdata.set('sticky', this.state.sticky);
        formdata.set('dateTime', this.state.dateTime);
        formdata.set('mainImage', this.state.mainImage);
        formdata.append('file', this.state.mainImageFile);

        const url = 'http://165.227.81.153:3005/getdata/editarticle/' + this.state.mainImage;
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
                this.getArticleAll()
                this.setState({
                    editArticle: false,
                    title: '',
                    content: '',
                    status_b: false,
                    sticky: false,
                    dateTime: this.state.dateTime,
                    mainImage: '',
                    mainImageFile: null,
                    tempfile: null,
                });
            })
    };
    addImagesClickOpen(e, imagesource) {
        this.setState({
            article_id: imagesource.article_id,
        }, () => {
            console.log(this.state.article_id);
        })
    }
    viewImagesClickOpen(e, imagesource) {
        localStorage.setItem('article_id', imagesource.article_id);
        localStorage.setItem('title', imagesource.title);
        let path = `/photographer/content/images`;
        this.props.history.push(path);
    }
    renderTableData() {
        if (this.state.imagesources !== []) {
            var no = (this.state.currentPage) * (this.state.rowsPerPage);
            return this.state.imagesources.map((imagesource, index) => {
                no = no + 1;
                return (
                    <tr key={index}>
                        <td>{no}</td>
                        <td>{imagesource.title}</td>
                        <td>{imagesource.status_b}</td>
                        <td>{imagesource.sticky}</td>
                        <td>{imagesource.dateTime}</td>
                        <td>
                            <img
                                src={"http://165.227.81.153:3005/uploads/articles/" + imagesource.article_id + '/' + imagesource.mainImage}
                                alt="new"
                                height="42" width="42"
                            />
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.openFileDgArticle(e, imagesource.article_id)}>{translations[this.state.selectedLan]['_ADD_IMAGES']}</Button>
                            <input id="myInput"
                                type="file"
                                ref={(ref) => this.uploadBtnArticle = ref}
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => this.onChangeFileArticle(e, imagesource.article_id)}
                            />
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.viewImagesClickOpen(e, imagesource)}>{translations[this.state.selectedLan]['_VIEW']}</Button>
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.editClickOpen(e, imagesource)}>{translations[this.state.selectedLan]['_EDIT']}</Button>
                        </td>
                        <td>
                            <Button class="toggle-button" id="centered-toggle-button" onClick={(e) => this.deleteClickOpen(e, imagesource)}>{translations[this.state.selectedLan]['_DELETE']}</Button>
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
            this.getArticleSources();
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
                this.getArticleSources();
            });
    };
    getArticleSources = () => {
        const { currentPage, rowsPerPage } = this.state;
        var imagesource_temp = [];
        for (let i = currentPage * rowsPerPage; i < (currentPage + 1) * rowsPerPage; i++) {
            if ((this.state.articleDataTotal)[i] !== undefined) {
                imagesource_temp[i - currentPage * rowsPerPage] = (this.state.articleDataTotal)[i];
            }
        }
        this.setState({
            imagesources: imagesource_temp,
        });
    }
    onAddArticle(e) {
        this.setState({
            openModal: true,
            editArticle: false,
        });
    }
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
                        {(!this.state.openModal && !this.state.editArticle) && <h1 style={{ textAlign: 'center' }}>{translations[this.state.selectedLan]['_ARTICLES']}</h1>}
                        <br />
                        <br />
                        {(!this.state.openModal && !this.state.editArticle) && <div style={{ marginTop: 15, textAlign: 'right' }}>
                            <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                onClick={(e) => this.onAddArticle(e)} style={{ marginLeft: 20, marginRight: 20 }}>
                                {translations[this.state.selectedLan]['_ADD_ARTICLE']}
                            </Button>
                        </div>}
                        <br />
                        {this.state.openModal && <div>
                            <h1 style={{ position: 'absolute', top: 30, right: '38vw' }}>{translations[this.state.selectedLan]['_CONTENT_MODAL_TITLE']}</h1>
                            {this.state.selectedLan === '0' && <div style={{ marginBottom: 20, textAlign: "left" }}>
                                <TextField
                                    label={translations[this.state.selectedLan]['_TITLE']}
                                    autoFocus
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                    style={{ marginLeft: 0, marginRight: '2vw', width: 300, marginBottom: 10 }}
                                />
                                <TextField
                                    style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: 10 }}
                                    label={translations[this.state.selectedLan]['_DATE']}
                                    name="dateTime"
                                    type="date"
                                    defaultValue={this.state.dateTime}
                                    value={this.state.dateTime}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                />
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select">{translations[this.state.selectedLan]['_STATUS']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select"
                                            name="status_b"
                                            value={this.state.status_b}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select_sticky">{translations[this.state.selectedLan]['_STICKY']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select_sticky"
                                            name="sticky"
                                            value={this.state.sticky}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                            </div>}
                            {this.state.selectedLan !== '0' && <div style={{ marginBottom: 20, textAlign: "right" }}>
                                <TextField
                                    label={translations[this.state.selectedLan]['_TITLE']}
                                    autoFocus
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                    style={{ marginLeft: '2vw', marginRight: 0, width: 300, marginBottom: 10 }}
                                />
                                <TextField
                                    style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: 10 }}
                                    label={translations[this.state.selectedLan]['_DATE']}
                                    name="dateTime"
                                    type="date"
                                    defaultValue={this.state.dateTime}
                                    value={this.state.dateTime}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                />
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select">{translations[this.state.selectedLan]['_STATUS']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select"
                                            name="status_b"
                                            value={this.state.status_b}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select_sticky">{translations[this.state.selectedLan]['_STICKY']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select_sticky"
                                            name="sticky"
                                            value={this.state.sticky}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                            </div>}
                            <div style={{ direction: 'rtl' }}>
                                <ReactQuill theme="snow" modules={this.modules}
                                    style={{ height: '50vh' }}
                                    formats={this.formats} onChange={this.rteChange}
                                    value={this.state.content || ''} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 70, marginBottom: 20, textAlign: 'left' }} className='MianImgMobile'>
                                <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                    onClick={(e) => this.openFileDg(e)} style={{ width: 150, marginTop: 0, marginRight: 0, marginLeft: 0 }}>
                                    {translations[this.state.selectedLan]['_MAIN_IMAGE']}
                                </Button>
                                <input id="myInput"
                                    type="file"
                                    ref={(ref) => this.uploadBtn = ref}
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={(e) => this.onChangeFile(e)}
                                />
                                <img src={this.state.tempFile} width="50" height="50" style={{ marginLeft: 20, marginRight: 20 }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={this.handleClose} color="primary" style={{ marginRight: 20, marginLeft: 20 }}>{translations[this.state.selectedLan]['_DISAGREE']}</Button>
                                <Button variant="contained" onClick={this.handleOpen} color="primary" autoFocus>{translations[this.state.selectedLan]['_AGREE']}</Button>
                            </div>
                        </div>}
                        {this.state.editArticle && <div>
                            <h1 style={{ position: 'absolute', top: 30, right: '38vw' }}>{translations[this.state.selectedLan]['_EDIT_ARTICLE_INFO']}</h1>
                            {this.state.selectedLan==='0'&& <div style={{ marginBottom: 20, textAlign: "left" }}>
                                <TextField
                                    label={translations[this.state.selectedLan]['_TITLE']}
                                    autoFocus
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                    style={{ marginLeft: 0, marginRight: '2vw', width: 300, marginBottom: 10 }}
                                />
                                <TextField
                                    style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: 10 }}
                                    label={translations[this.state.selectedLan]['_DATE']}
                                    name="dateTime"
                                    type="date"
                                    defaultValue={this.state.dateTime}
                                    value={this.state.dateTime}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                />
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select">{translations[this.state.selectedLan]['_STATUS']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select"
                                            name="status_b"
                                            value={this.state.status_b}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select_sticky">{translations[this.state.selectedLan]['_STICKY']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select_sticky"
                                            name="sticky"
                                            value={this.state.sticky}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                            </div>}
                            {this.state.selectedLan!=='0'&& <div style={{ marginBottom: 20, textAlign: "right" }}>
                                <TextField
                                    label={translations[this.state.selectedLan]['_TITLE']}
                                    autoFocus
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                    style={{ marginRight: 0, marginLeft: '2vw', width: 300, marginBottom: 10 }}
                                />
                                <TextField
                                    style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: 10 }}
                                    label={translations[this.state.selectedLan]['_DATE']}
                                    name="dateTime"
                                    type="date"
                                    defaultValue={this.state.dateTime}
                                    value={this.state.dateTime}
                                    onChange={this.onChangeInput}
                                    variant="outlined"
                                    required
                                />
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select">{translations[this.state.selectedLan]['_STATUS']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select"
                                            name="status_b"
                                            value={this.state.status_b}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl} style={{ marginLeft: '3vw', marginRight: '3vw' }}>
                                    <InputLabel htmlFor="grouped-native-select_sticky">{translations[this.state.selectedLan]['_STICKY']}</InputLabel>
                                    <Select native defaultValue=""
                                        input={<Input id="grouped-native-select_sticky"
                                            name="sticky"
                                            value={this.state.sticky}
                                            onChange={this.onChangeInput}
                                            variant="outlined"
                                            style={{ width: 100 }}
                                        />}>
                                        <option value={0}>{translations[this.state.selectedLan]['_FALSE']}</option>
                                        <option value={1}>{translations[this.state.selectedLan]['_TRUE']}</option>
                                    </Select>
                                </FormControl>
                            </div>}
                            <div>
                                <ReactQuill theme="snow" modules={this.modules}
                                    style={{ height: '50vh' }}
                                    formats={this.formats} onChange={this.rteChange}
                                    value={this.state.content || ''} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 70, marginBottom: 20, textAlign: 'left' }} className='MianImgMobile'>
                                <Button variant="contained" color="primary" className="w-224 mx-auto mt-16" aria-label="LOG IN"
                                    onClick={(e) => this.openFileDg(e)} style={{ width: 150, marginTop: 0, marginRight: 0, marginLeft: 0 }}>
                                    {translations[this.state.selectedLan]['_MAIN_IMAGE']}
                                </Button>
                                <input id="myInput"
                                    type="file"
                                    ref={(ref) => this.uploadBtn = ref}
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={(e) => this.onChangeFile(e)}
                                />
                                {this.state.tempFile !== null && <img src={this.state.tempFile} width="50" height="50" />}
                                {this.state.tempFile === null && <img
                                    src={"http://165.227.81.153:3005/uploads/articles/" + this.state.article_id + '/' + this.state.mainImage}
                                    alt="new"
                                    height="50" width="50"
                                    style={{ marginRight: 20, marginLeft: 20 }}
                                />}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={this.editClose} color="primary" style={{ marginRight: 20, marginLeft: 20 }}>{translations[this.state.selectedLan]['_DISAGREE']}</Button>
                                <Button variant="contained" onClick={this.editOpen} color="primary" autoFocus>{translations[this.state.selectedLan]['_AGREE']}</Button>
                            </div>
                        </div>}

                        <br />
                        {
                            !this.state.openModal && !this.state.editArticle && <div>
                                <table id='usersDatas'>
                                    {(this.state.usersDatas !== []) && this.state.isUploaded && <tbody>
                                        <tr>
                                            <th>{translations[this.state.selectedLan]['_NO']}</th>
                                            <th>{translations[this.state.selectedLan]['_TITLE']}</th>
                                            <th>{translations[this.state.selectedLan]['_STATUS']}</th>
                                            <th>{translations[this.state.selectedLan]['_STICKY']}</th>
                                            <th>{translations[this.state.selectedLan]['_DATE_TIME']}</th>
                                            <th>{translations[this.state.selectedLan]['_MAIN_IMAGE']}</th>
                                            <th>{translations[this.state.selectedLan]['_ADD_IMAGES']}</th>
                                            <th>{translations[this.state.selectedLan]['_VIEW_IMAGES']}</th>
                                            <th>{translations[this.state.selectedLan]['_EDIT']}</th>
                                            <th>{translations[this.state.selectedLan]['_DELETE_ARTICLE']}</th>
                                        </tr>
                                        {this.renderTableData()}
                                    </tbody>}
                                    {!this.state.isUploaded && <CircularProgress disableShrink />}
                                </table>
                            </div>
                        }
                        {
                            !this.state.openModal && !this.state.editArticle && <div>
                                <TablePagination
                                    dir='ltr'
                                    style={this.state.selectedLan === '0' ? { overflow: 'auto' } : { overflow: 'auto', display: 'flex' }}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    labelRowsPerPage=''
                                    component="div"
                                    count={totalElements}
                                    rowsPerPage={rowsPerPage}
                                    page={currentPage}
                                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            </div>
                        }

                        <Dialog
                            open={this.state.openModalDeleteArticle}
                            onClose={this.deleteClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            dir={this.state.selectedLan === '0' ? 'ltr' : 'rtl'}
                        >
                            <DialogTitle id="alert-dialog-title">{translations[this.state.selectedLan]['_ARTICLE_DELETE']}</DialogTitle>
                            <DialogActions>
                                <Button onClick={this.deleteClose} color="primary">
                                    {translations[this.state.selectedLan]['_DISAGREE']}
                                </Button>
                                <Button onClick={this.deleteOpen} color="primary" autoFocus>
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

export default withStyles(styles, { withTheme: true })(withRouter(Content));