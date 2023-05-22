// import responseHandler from '../handlers/response.handler.js'
// import api from '../api/api.js'

// // Chi tiết diễn viên
// const personDetail = async (req, res) => {
//     try {
//         const { personId } = req.params
//         const person = await api.personDetail({ personId })

//         return responseHandler.ok(res, person)
//     } catch {
//         responseHandler.error(res, 'Lấy chi tiết cast thất bại')
//     }
// }

// // Lấy danh sách các phim mà diễn viên đã tham gia
// const personMedias = async (req, res) => {
//     try {
//         const { personId } = req.params
//         const medias = await api.personMedias({ personId })

//         return responseHandler.ok(res, medias)
//     } catch {
//         responseHandler.error(res, 'Lấy danh sách cast thất bại')
//     }
// }

// export default { personDetail, personMedias }
