// import firebase from 'firebase/compat/app'
// import 'firebase/compat/firestore'
// import responseHandler from '../handlers/response.handler.js'

// // Cấu hình Firebase
// const firebaseConfig = {
//     apiKey: 'AIzaSyBo1znH1y1-YjcKiIAr_cMPiW_naC432A8',
//     authDomain: 'finder-cookies.firebaseapp.com',
//     databaseURL: 'https://finder-cookies-default-rtdb.asia-southeast1.firebasedatabase.app',
//     projectId: 'finder-cookies',
//     storageBucket: 'finder-cookies.appspot.com',
//     messagingSenderId: '1030076656949',
//     appId: '1:1030076656949:web:022b254158aeac6a76707c',
//     measurementId: 'G-JWHCT63N7K',
// }

// // Khởi tạo ứng dụng Firebase
// firebase.initializeApp(firebaseConfig)

// // Lấy tham chiếu tới Firestore
// const db = firebase.firestore()

// // Middleware để lưu cookie vào Firestore
// const saveCookieMiddleware = (req, res, next) => {
//     // Lấy cookie từ request
//     const cookie = req.cookiesData

//     // Lưu cookie vào Firestore
//     db.collection('cookies')
//         .add({ cookie })
//         .then((docRef) => {
//             const documentId = docRef.id
//             console.log('Lưu thành công với ID:', documentId)
//             next()
//         })
//         .catch((error) => {
//             console.error('Lỗi khi lưu cookie vào Firestore:', error)
//             responseHandler.error(res, 'Internal Server Error')
//         })
// }

// const getCookie = (req, res, next) => {
//     const { userId } = req.params
//     console.log(userId);
//     db.collection('cookies')
//         .where('userId', '==', userId)
//         .get()
//         .then((snapshot) => {
//             if (snapshot.empty) {
//                 console.log('Không tìm thấy cookie cho người dùng có ID:', userId)
//                 responseHandler.notfound(res, 'Không tìm thấy cookies')
//             } else {
//                 // Chỉ lấy cookie của người dùng đầu tiên trong danh sách
//                 const cookie = snapshot.docs[0].data().cookie
//                 console.log('Lấy cookie thành công cho người dùng có ID:', userId)
//                 res.json({ cookie })
//                 next()
//             }
//         })
//         .catch((error) => {
//             console.error('Lỗi khi lấy cookie từ Firestore:', error)
//             res.status(500).json({ error: 'Lỗi khi lấy cookie' })
//         })
        
// }

// export default { saveCookieMiddleware, getCookie }
