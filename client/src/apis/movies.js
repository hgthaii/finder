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
export const top10Movies = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                url: 'movies/hot-movies/top-movies',
                method: 'get',
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
export const getMoviesByGenre = (genreId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                url: `movies/genre/${genreId}`,
                method: 'get',
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}

export const genreKorean = () => {
    const genreId = '6458a49f381ed3355d4d0f12' // ID thể loại phim Hàn Quốc
    return getMoviesByGenre(genreId)
}

export const genreCriminal = () => {
    const genreId = '645f98ac88496ce8285e777e' // ID thể loại phim tội phạm
    return getMoviesByGenre(genreId)
}

export const genreAction = () => {
    const genreId = '647b7c5521aca349a8e66453' // ID thể loại phim hành động
    return getMoviesByGenre(genreId)
}

export const genreFamily = () => {
    const genreId = '647b7c4521aca349a8e66445' // ID thể loại phim gia đình
    return getMoviesByGenre(genreId)
}

export const genreAgent = () => {
    const genreId = '647b8530c98c9b1d03f16a06' // ID thể loại phim hành động và điệp viên
    return getMoviesByGenre(genreId)
}

export const genreDocumentary = () => {
    const genreId = '64a546394e163a0e474cad0b' // ID thể loại phim tài liệu
    return getMoviesByGenre(genreId)
}

export const genreComedy = () => {
    const genreId = '647b815320174e852a40f607' // ID thể loại phim hài
    return getMoviesByGenre(genreId)
}

export const genreAnime = () => {
    const genreId = '6458ad2fe23b28408df8b3ac' // ID thể loại phim anime
    return getMoviesByGenre(genreId)
}

export const genreScienFiction = () => {
    const genreId = '647b7c7321aca349a8e6646d' // ID thể loại phim khoa học viễn tưởng
    return getMoviesByGenre(genreId)
}

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
