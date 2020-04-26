import React, { useState } from 'react'
import { ReactComponent as CommentIcon } from '../icons/comment-icon.svg'; 
import { ReactComponent as LikeIcon } from '../icons/like-icon.svg';
import { ReactComponent as TrashIcon} from '../icons/trash-icon.svg';
import { ReactComponent as PushpinIcon } from '../icons/pushpin-icon.svg';
import { ReactComponent as AcceptIcon } from '../icons/accept-icon.svg';
import { ReactComponent as DeleteIcon } from '../icons/delete-icon.svg';
import axios from 'axios';
import * as actions from '../actions/';
import { connect } from 'react-redux';

const Comment = (props) => {
    const [isLiked, setLiked] = useState(props.isLiked);

    const deleteComment = async () => {
        try {
            await axios.post('/api/delete_comment', { _id: props._id, eventId: props.eventId });
            props.deleteComment(props._id);
        } catch (err) {
            alert('Couldnt delete comment, unidentified error'); //gdy sie nie uda usunac komentarza
        }
    }

    const pinComment = async () => {
        try {
            await axios.post('/api/pin_comment', { _id: props._id, eventId: props.eventId });
            props.pinComment(props._id);
        } catch (err) {
            alert('Couldnt pin comment, unidentified error');
        }
    }

    const unpinComment = async () => {
        try {
            await axios.post('/api/unpin_comment', { _id: props._id, eventId: props.eventId });
            props.unpinComment(props._id);
        } catch (err) {
            alert('Couldnt unpin comment, unidentified error');
        }
    }

    const likeComment = async () => {
        try {
            await axios.post('/api/like_comment', { _id: props._id, eventId: props.eventId });
            props.likeComment(props._id);
            setLiked(true);
        } catch (err) {
            alert('Couldnt like comment, unidentified error'); //gdy sie nie uda usunac komentarza
        }
    }

    const dislikeComment = async () => {
        try {
            console.log('disliked');
            await axios.post('/api/dislike_comment', { _id: props._id, eventId: props.eventId });
            props.dislikeComment(props._id);
            setLiked(false);
        } catch (err) {
            alert('Couldnt dislike comment, unidentified error'); //gdy sie nie uda usunac komentarza
        }
    }

    const approveComment = async () => {
        try {
            await axios.post('/api/approve_comment', { _id: props._id, eventId: props.eventId });
            props.approveComment(props._id);
            props.socket.emit('approved_comment', {
                likes: props.likes,
                isPinned: props.isPinned,
                _id: props._id,
                nickname: props.authorName,
                content: props.text,
                approved: props.approved,
                dateCreated: props.dateCreated
            });
        } catch (err) {
            alert('Couldnt approve comment, unidentified error');
        }
    }

    const renderApproved = () => {
        return (
            <div className="comment__container-social comment__container-social--approved">
                <div className="comment__container-icon">
                    <LikeIcon className={`comment__social-icon ${isLiked ? 'pinned' : ''}`} 
                              onClick={isLiked ? dislikeComment : likeComment}/>
                    <span>{props.likes}</span>
                </div>
                <div className="comment__container-icon">
                    <CommentIcon className="comment__social-icon"/><span>0</span>
                </div>  
                {/* <div className="comment__container-icon">Show replies</div> */}
                {props.canPinComment && <div className="comment__container-icon comment__container-icon--pin">
                    <PushpinIcon className={`comment__social-icon ${props.isPinned ? 'pinned' : ''}`}
                                 onClick={props.isPinned ? unpinComment : pinComment}/>
                </div>}
                {props.canDeleteComment && <div className="comment__container-icon comment__container-icon--delete">
                    <TrashIcon className="comment__social-icon comment__social-icon--delete"
                               onClick={deleteComment}/>
                </div>}
            </div>
        )
    }

    const renderWaitingApproval = () => {
        if (props.didUserCreatedEvent) {
            return (
                <div className="comment__container-social comment__container-social--waiting-admin">
                    <div className="comment__container-icon
                                    comment__container-icon--approve"
                         onClick={approveComment}>
                        <AcceptIcon className="comment__social-icon
                                                comment__social-icon--approve"/>
                        <span>approve</span>
                    </div>                  
                    <div className="comment__container-icon
                                    comment__container-icon--disapprove"
                         onClick={deleteComment}>
                        <DeleteIcon className="comment__social-icon
                                                comment__social-icon--disapprove"/>
                        <span>delete</span>
                    </div>  
                </div>
            );
        } else {
            return (
                <div className="comment__container-social                         
                                comment__container-social--waiting-user">
                    <div>Waiting for approval</div>                
                    <div className="comment__container-icon"
                         onClick={deleteComment}>
                        <TrashIcon className="comment__social-icon
                                              comment__social-icon--delete"/>
                    </div>  
                </div>
            );
        }
    }

    return (
        <div className={`comment comment__container-master 
                        ${props.isPinned ? 'comment__container-master--pinned' : ''}`}>
            <div className="comment__container-info">
                <div className="comment__author">{props.authorName}</div>
                <div className="comment__date">
                    {new Date(props.dateCreated).toLocaleDateString()} at {new Date(props.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <div className="comment__text">
                {props.text}
            </div>
            {props.approved ? renderApproved() : renderWaitingApproval()}
        </div>
    )
}

export default connect(null, actions)(Comment);