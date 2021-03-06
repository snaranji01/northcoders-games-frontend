import { useContext, useEffect, useState } from "react"

import './Comments.css';

import { getReviewCommentsById } from "../../../api"

import { SingleCommentObj, SingleReviewObj } from "../../../types/types";

import { formatCreatedAtComment } from "../../../utils/utils";

import { UserContext } from "../../../contexts/User";
import { AxiosError } from "axios";
import ErrorPage from "../../ErrorPage/ErrorPage";
import { onCommentInputTextChangeHandler, postCommentHandler, sortCommentsHandler } from "./eventHandlers";
import UpvoteButton from "./CommentUpvoteButton/CommentUpvoteButton";

interface IProps {
    review_id: string;
    singleReviewData: SingleReviewObj;
}

const Comments: React.FC<IProps> = ({ review_id }) => {
    const { currentUser } = useContext(UserContext);

    const [reviewComments, setReviewComments] = useState<SingleCommentObj[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);

    const [error, setError] = useState<AxiosError | Error | null>(null);

    useEffect(() => {
        setIsLoadingComments(true);
        getReviewCommentsById(review_id)
            .then(response => {
                setReviewComments(reviewComments => {
                    let newReviewComments = [...reviewComments];
                    newReviewComments = response.sort((a, b) => {
                        if (a.created_at < b.created_at) {
                            return 1
                        } else if (a.created_at > b.created_at) {
                            return -1
                        } else return 0
                    });
                    return newReviewComments
                });
                setIsLoadingComments(false);
            })
            .catch(error => {
                setError(error)
            })
    }, [review_id]);

    const [commentInputBoxValue, setCommentInputBoxValue] = useState<string>('');




    const sortCommentOptions = [
        { keyName: "created_at", displayName: "Created at" },
        { keyName: "author", displayName: "Author" },
        { keyName: "comment_votes", displayName: "Upvotes" },
    ];

    if (error) return <ErrorPage error={error} />
    return (
        <>
            <h2>Comments</h2>
            {
                currentUser !== null ? (
                    <div className="add-comment">
                        <form onSubmit={e => postCommentHandler(e, setReviewComments, review_id, currentUser, commentInputBoxValue, error, setError)}>
                            <label htmlFor="add-comment-input">Post a comment as <span style={{ fontWeight: "bold" }}>{currentUser.username}</span>: </label>
                            <input
                                type="text"
                                name="add-comment-input"
                                id="add-comment-input"
                                value={commentInputBoxValue}
                                onChange={e => onCommentInputTextChangeHandler(e, setCommentInputBoxValue)}
                            />
                            <button type="submit">Post comment</button>
                        </form>
                    </div>
                ) : null
            }

            {
                reviewComments.length !== 0 ? (
                    !isLoadingComments ? (
                        <div className="comments-list">
                            <div className="sort-comments">
                                <select
                                    name="sort-comments-options"
                                    id="sort-comments-options"
                                    onChange={e => sortCommentsHandler(e, setReviewComments)}
                                >
                                    {
                                        sortCommentOptions.map(sortCommentOption => {
                                            return <option
                                                key={sortCommentOption.keyName}
                                                value={sortCommentOption.keyName}
                                            >
                                                {sortCommentOption.displayName}
                                            </option>
                                        })
                                    }
                                </select>
                            </div>
                            {
                                reviewComments.map(reviewComment => {
                                    return (
                                        <div className="review-comment" key={reviewComment.comment_id}>
                                            <h3>{reviewComment.author}</h3>
                                            <p>Date Posted: {formatCreatedAtComment(reviewComment.created_at)}</p>
                                            <p>{reviewComment.body}</p>
                                            <UpvoteButton reviewComment={reviewComment} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : <p>Loading...</p>
                ) : <p>No existing comments</p>
            }
        </>
    )
}

export default Comments;