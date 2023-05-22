import axios from '../axios'

export const apiMoviesRandom = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                url: '/movies/random/random-movies',
                method: 'get',
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })

export const apiSearchMovies = (title) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                url: '/genres/media/search',
                method: 'get',
                params: { title },
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
