import actionType from './actionType'
import * as apis from '../../apis'
import axios from 'axios'
export const search = (keyword) => async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/genres/media/search?search=${keyword}`)
        if (response.status === 200) {
            dispatch({
                type: actionType.SEARCH,
                data: response.data,
            })
        } else {
            dispatch({
                type: actionType.SEARCH,
                data: null,
            })
        }
    } catch (error) {
        dispatch({
            type: actionType.SEARCH,
            data: null,
        })
    }
}

export const getGenres = (idGenre) => async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/genre/${idGenre}`)
        if (response.status === 200) {
            dispatch({
                type: actionType.GENRES,
                data: response.data,
            })
        } else {
            dispatch({
                type: actionType.GENRES,
                data: null,
            })
        }
    } catch (error) {
        dispatch({
            type: actionType.GENRES,
            data: null,
        })
    }
}

export const getDetailtMovies = (mid) => async (dispatch) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/movies/${mid}`)
        if (response.status === 200) {
            dispatch({
                type: actionType.DETAI_MOVIES,
                data: response.data,
            })
        } else {
            dispatch({
                type: actionType.DETAI_MOVIES,
                data: null,
            })
        }
    } catch (error) {
        dispatch({
            type: actionType.DETAI_MOVIES,
            data: null,
        })
    }
}
export const searchMovies = (movies) => ({
    type: actionType.GET_MOVIES,
    payload: movies,
})