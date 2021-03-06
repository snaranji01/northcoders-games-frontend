import axios, { AxiosInstance } from 'axios';
import { AllCategoriesResponseObj, FilterParams, SingleCommentObj, SingleReviewObj, User } from './types/types';


const ncgamesAPI: AxiosInstance = axios.create({
    baseURL: "https://nc-games-backend-snaranji01.herokuapp.com/api"
});

export const getReviews = (filterParams: FilterParams): Promise<SingleReviewObj[]> => {

    const params = {
        sort_by: filterParams.sortBy,
        order: filterParams.order,
        category: filterParams.category
    }

    return ncgamesAPI
        .get('/reviews', { params })
        .then(response => {
            return response.data.reviews;
        })
}

export const getReviewById = (review_id: string): Promise<SingleReviewObj> => {
    return ncgamesAPI
        .get(`/reviews/${review_id}`)
        .then(response => response.data.review)
}

export const getReviewCommentsById = (review_id: string): Promise<SingleCommentObj[]> => {
    return ncgamesAPI
        .get(`/reviews/${review_id}/comments`)
        .then(response => response.data.reviewComments)
}

export const postReviewComment = (
    review_id: string, username: string, body: string
    ): Promise<SingleCommentObj> => {
    const postBody = { username, body };
    return ncgamesAPI
        .post(`reviews/${review_id}/comments`, postBody)
        .then(response => response.data.newReviewComment)
}

export const getCategories = () : Promise<AllCategoriesResponseObj[]> => {
    return ncgamesAPI
        .get('/categories')
        .then(response => {
            return response.data.categories;
        })
}

export const getUsers = () : Promise<User[]> => {
    return ncgamesAPI
        .get('/users')
        .then(response => {
            return response.data.users;
        })
}

export const getUserByUsername = (username: string): Promise<User> => {
    return ncgamesAPI
        .get(`/users/${username}`)
        .then(response => {
            return response.data.user;
        })
}

export const patchCommentVotes = (numUpvotes: number, comment_id: number) : Promise<SingleCommentObj> => {
    const reqBody = {
        inc_votes: numUpvotes
    }
    console.log(reqBody)
    return ncgamesAPI
        .patch(`/comments/${comment_id}`, reqBody)
        .then(response => response.data.updatedComment)
}