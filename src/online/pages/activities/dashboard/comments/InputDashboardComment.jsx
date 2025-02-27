import React, { useState, useRef } from 'react';
import { TextField, Button, Box, IconButton, Tooltip, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useMutation } from '@apollo/client';
import { Send } from '@mui/icons-material';
import { POST_DASHBOARD_COMMENT, PUT_DASHBOARD_COMMENT } from '../../../../../_shared/graphql/mutations/DashboardCommentMutations';

export default function InputSendDashboardComment({ inputType='text', multiline=true, type=null, onDashboardCommentSent, defaultDashboardComment, establishment, commentType, year, month  }) {
    const [editMode, setEditMode] = useState(false);
    const [dashboardComment, setDashboardComment] = useState(defaultDashboardComment || { id: null, text: '', establishment, commentType, year, month });
    const inputRef = useRef(null);

    const [createDashboardComment, { loading: loadingPost }] = useMutation(POST_DASHBOARD_COMMENT, {
        onCompleted: (data) => {
            let { __typename, ...dashboardCommentCopy } = data.createDashboardComment.dashboardComment;
            if (dashboardCommentCopy && onDashboardCommentSent) {
                setDashboardComment({ ...dashboardComment, id: dashboardCommentCopy.id });
                onDashboardCommentSent()
            };
            setEditMode(false);
        },
        onError: (err) => {
            console.warn(err);
        },
    });
    const [updateDashboardComment, { loading: loadingPut }] = useMutation(PUT_DASHBOARD_COMMENT, {
        onCompleted: (data) => {
            let { __typename, ...dashboardCommentCopy } = data.updateDashboardComment.dashboardComment;
            if (dashboardCommentCopy && onDashboardCommentSent) onDashboardCommentSent();
            setEditMode(false);
        },
        onError: (err) => {
            console.warn(err);
        },
    });

    const handleSendDashboardComment = () => {
        if (dashboardComment?.id && dashboardComment?.id != ''){
            updateDashboardComment({
                variables: {
                    id: dashboardComment.id,
                    dashboardCommentData: {
                        text: dashboardComment.text,
                    },
                },
            });
        }else{
            if (dashboardComment.text.trim() === '') {
                setEditMode(false);
                return;
            }
            createDashboardComment({
                variables: {
                    dashboardCommentData: {
                        text: dashboardComment.text,
                        establishment,
                        commentType,
                        year,
                        month,
                    },
                },
            });
        }
    };

    const handleBlur = () => {
        handleSendDashboardComment();
    };

    return (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
            {editMode ? (
                <TextField
                    sx={{minWidth: 60}}
                    type={inputType}
                    fullWidth
                    multiline={multiline}
                    variant="outlined"
                    value={dashboardComment.text}
                    onChange={(e) => setDashboardComment({ ...dashboardComment, text: e.target.value })}
                    onBlur={handleBlur}
                    autoFocus
                    inputRef={inputRef}
                    disabled={loadingPost || loadingPut}
                />
            ) : (
                <Typography
                    variant="body1"
                    onClick={() => setEditMode(true)}
                    style={{ cursor: 'pointer', flex: 1, padding: '10px', border: '1px dashed #ccc', borderRadius: '5px' }}
                >
                    {dashboardComment.text || ""}
                </Typography>
            )}

            {editMode && type && (
                type !== 'iconButton' ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendDashboardComment}
                        endIcon={<SendIcon />}
                        style={{ marginLeft: 8 }}
                    >
                        Envoyer
                    </Button>
                ) : (
                    <Tooltip title="Envoyer">
                        <IconButton
                            color="primary"
                            onClick={handleSendDashboardComment}
                            style={{ marginLeft: 8 }}
                        >
                            <Send />
                        </IconButton>
                    </Tooltip>
                )
            )}
        </Box>
    );
}
