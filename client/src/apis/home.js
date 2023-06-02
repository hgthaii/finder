import axios from '../axios'

export const getMovies = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                url: '/movies',
                method: 'get',
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
