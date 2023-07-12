import React from 'react'

const ContactUs = () => {
    return (
        <div className='flex flex-col items-center  w-full h-full'>
            <div className=' bg-main-200 dark:bg-main-100 max-w-3xl dark:text-main-300 text-white mt-[100px]  px-10'>
                <h4 className='text-[40px] font-bold'>Liên hệ với chúng tôi</h4>
                <h3 className='text-xl font-bold'>Hãy chia sẻ thêm và chúng tôi sẽ tìm giải pháp tốt nhất cho bạn</h3>
                <div class="relative flex flex-nowrap items-stretch mt-4">
                    <input
                        type="text"
                        class="relative m-0 block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none  "
                        placeholder="Mô tả sự cố của bạn"
                        aria-label="Username"
                        aria-describedby="addon-wrapping" />
                </div>
                <div className='mt-4' >
                    <h3 className='text-xl font-bold mb-4'>Liên kết nhanh</h3>
                    <p className="mb-4 hover:underline decoration-red-400">
                        <a href="#!"
                        >Đặt lại mật khẩu</a
                        >
                    </p>
                    <p className="mb-4 hover:underline decoration-red-400 ">
                        <a href="#!"
                        >Cập nhật email</a
                        >
                    </p>
                    <p className="mb-4 hover:underline decoration-red-400">
                        <a href="#!"
                        >Nhận trợ giúp để đăng nhập</a
                        >
                    </p>
                    <p className="mb-4 hover:underline decoration-red-400">
                        <a href="#!"
                        >Cập nhật phương thức thanh toán</a
                        >
                    </p>
                    <p className="mb-4 hover:underline decoration-red-400">
                        <a href="#!"
                        >Yêu cầu chương trình truyền hình hoặc phim</a
                        >
                    </p>
                </div>
            </div>

        </div>
    )
}

export default ContactUs
