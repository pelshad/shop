import React from 'react';
import styled from "styled-components";
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TextEditor = ({ setContent, setImageCode, width, type, value }) => {
    let arr = [];
    const API = `${process.env.REACT_APP_API_URL}/editor/ins_editor_data`;
    const uploadAdapter = (loader) => {
        const code = Math.floor((Math.random() * (99999 - 10000) + 10000));
        arr.push(code);
        setImageCode(arr);
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append("uploadImg", file);
                        axios.post(`${API}?imageCode=${code}&type=${type}`, body).then((res) => {
                            resolve({ default: `${res.data.result.img_path + '?code=' + code}` });
                        }).catch((error) => {
                            reject(error);
                        })
                    })
                })
            }
        }
    }

    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        }
    }

    return (
        <Div width={width}>
            <CKEditor
                config={{
                    extraPlugins: [uploadPlugin],
                    mediaEmbed: {
                        previewsInData: true
                    }
                }}
                editor={ClassicEditor}
                data={value}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
                onBlur={(event, editor) => {
                    // console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    // console.log('Focus.', editor);
                }}
            />
        </Div>
    );
};

const Div = styled.div`
    .ck.ck-reset.ck-editor.ck-rounded-corners{
        width: ${(props) => props.width}px;
    }
    .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
        min-height: 300px;
        max-height: 300px;
        overflow-y: scroll;
        margin-bottom: 20px;
    }
`;

export default TextEditor;