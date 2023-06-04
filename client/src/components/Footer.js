import React from 'react'

import logo from '../../src/asset/image/logo.png'

const Footer = () => {
    return (
        <div className=" bg-[#090B13] flex flex-col justify-between items-center text-white mt-[40px] p-10">
            <div className="pt-4">
                <img src={logo} alt="logo" />
            </div>
            <div className="flex gap-10 pt-4">
                <span>Chính sách bảo mật</span>
                <span>Giúp đỡ</span>
                <span>Thiết bị hỗ trợ</span>
                <span>Về Finder</span>
            </div>
            <div className="pt-4">
                <span>© Copyright by Finder</span>
            </div>
        </div>
    )
}

export default Footer
