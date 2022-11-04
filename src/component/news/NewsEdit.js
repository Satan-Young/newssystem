/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-30 17:16:08
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-01 14:17:42
 * @FilePath: \newssystem2\src\component\news\NewsEdit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEdit(props) {

    const [editorState, setEditorState] = useState('')
    useEffect(() => {
        const html = props.content;
        if (html === undefined) return 
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])
    return (
        <div>
            <Editor
                editorState={editorState}
                // toolbarClassName="toolbarClassName"
                // wrapperClassName="wrapperClassName"
                // editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { setEditorState(editorState) }}
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
