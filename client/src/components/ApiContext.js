import React, { createContext, useState, useEffect } from 'react'
import * as apis from '../apis'

// Khởi tạo Context API
export const ApiContext = createContext()

// Khởi tạo Provider
export const ApiProvider = ({ children }) => {
    const [top10Movies, setTop10Movies] = useState(null)
    const [randomMovies, setRandomMovie] = useState(null)
    const [genreDocumentary, setGenreDocumentary] = useState(null)
    const [genreComedy, setGenreComedy] = useState(null)
    const [genreAgent, setGenreAgent] = useState(null)
    const [genreKorean, setGenreKorean] = useState(null)
    const [genreAnime, setGenreAnime] = useState(null)
    const [genreAction, setGenreAction] = useState(null)
    const [genreFamily, setGenreFamily] = useState(null)
    const [genreScienFiction, setGenreScienFiction] = useState(null)
    const [genreCriminal, setGenreCriminal] = useState(null)

    const fetchDocumentary = async () => {
        const response = await apis.genreDocumentary()
        setGenreDocumentary(response)
    }
    const fetchComedy = async () => {
        const response = await apis.genreComedy()
        setGenreComedy(response)
    }
    const HandleGettop10Movies = async () => {
        const reponse = await apis.top10Movies()
        setTop10Movies(reponse)
    }
    const HandleGetRandomMovies = async () => {
        try {
            const response = await apis.apiMoviesRandom()
            setRandomMovie(response)
            // Xử lý dữ liệu nhận được
        } catch (error) {
            // Xử lý lỗi
            console.error(error)
        }
    }
    const fetchAgent = async () => {
        const response = await apis.genreAgent()
        setGenreAgent(response)
    }
    const fetchFamily = async () => {
        const response = await apis.genreFamily()
        setGenreFamily(response)
    }
    const fetchAction = async () => {
        const response = await apis.genreAction()
        setGenreAction(response)
    }
    const fetchScienFiction = async () => {
        const response = await apis.genreScienFiction()
        setGenreScienFiction(response)
    }
    const fetchGenreAnime = async () => {
        const response = await apis.genreAnime()
        setGenreAnime(response)
    }
    const fetchGenreCriminal = async () => {
        const response = await apis.genreCriminal()
        setGenreCriminal(response)
    }
    const fetchGenreKorean = async () => {
        const response = await apis.genreKorean()
        setGenreKorean(response)
    }
    useEffect(() => {
        fetchFamily()
        fetchAction()
        fetchScienFiction()
        fetchGenreAnime()
        fetchGenreCriminal()
        fetchGenreKorean()
        fetchAgent()
        fetchComedy()
        fetchDocumentary()
        HandleGettop10Movies()
        HandleGetRandomMovies()
        // ...
    }, [])

    useEffect(() => {
        const top10Movies = async () => {
            const reponse = await apis.top10Movies()
            setTop10Movies(reponse)
        }
        top10Movies()
    }, [])

    return (
        <ApiContext.Provider
            value={{
                top10Movies,
                randomMovies,
                genreDocumentary,
                genreComedy,
                genreAgent,
                genreKorean,
                genreAnime,
                genreAction,
                genreFamily,
                genreScienFiction,
                genreCriminal,
            }}
        >
            {children}
        </ApiContext.Provider>
    )
}
