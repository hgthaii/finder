import actionType from '../actions/actionType'

const initState = {
    movies: [],
    radomMovies: [],
    searchData: [],
    genreData: [],
    detailsMovies: [],
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionType.GET_MOVIES:
            return {
                ...state,
                movies: action.homeData,
            }
        case actionType.RANDOM_MOVIES:
            return {
                ...state,
                radomMovies: action.randomMovies,
            }
        case actionType.SEARCH:
            return {
                ...state,
                searchData: action.data || [],
            }
        case actionType.GENRES:
            return {
                ...state,
                genreData: action.data || [],
            }
        case actionType.DETAI_MOVIES:
            return {
                ...state,
                detailsMovies: action || [],
            }
        default:
            return state
    }
}

export default appReducer
