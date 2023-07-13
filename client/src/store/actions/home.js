import actionType from './actionType'
import * as apis from '../../apis'

export const getHome = () => async (dispatch) => {
    try {
        // const response = await apis.getMovies()
        // dispatch({
        //     type: actionType.GET_MOVIES,
        //     homeData: response,
        // })
        // console.log('this is home');
    } catch (error) {
        dispatch({
            type: actionType.GET_MOVIES,
            homeData: null,
        })
    }
}
export const randomMovies = () => async (dispatch) => {
    try {
        const response = await apis.apiMoviesRandom()
        dispatch({
            type: actionType.RANDOM_MOVIES,
            randomMovies: response,
        })
    } catch (error) {
        dispatch({
            type: actionType.RANDOM_MOVIES,
            randomMovies: null,
        })
    }
}
