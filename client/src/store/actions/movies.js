import actionType from "./actionType";
import * as apis from '../../apis'
import axios from 'axios'

export const search = (keyword) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/genres/media/search?title=${keyword}`)
        if (response.status === 200) {
            dispatch({
                type: actionType.SEARCH, data: response.data
            })
        } else {
            dispatch({
                type: actionType.SEARCH, data: null
            })
        }

    } catch (error) {
        dispatch({
            type: actionType.SEARCH,
            data: null
        })
    }
}