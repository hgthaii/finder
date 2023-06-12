import axios from 'axios'

const get = async (url) => {
    const response = await axios.get(url, {
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'identity',
        },
        withCredentials: true, // Thêm withCredentials vào cấu hình
    })
    return response.data
}

export default { get }
