import React from 'react'

import logo from '../../src/asset/image/logo.png'

const Footer = () => {
    return (
        <div className="bg-[#030014]  text-white w-full dark:text-black dark:bg-[#fafafc]">
            <div className="  p-4 text-center">
                <div className="mb-6 flex justify-center">
                    <img src={logo} alt="logo" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">Chính sách bảo mật</span>
                    </div>
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">Giúp đỡ</span>
                    </div>
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">Thiết bị hỗ trợ</span>
                    </div>
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">Về Finder</span>
                    </div>
                </div>
            </div>
            <div
                className="p-4 text-center"
            >
                © 2023 Copyright:
                <a className="text-white dark:text-black" href="https://tailwind-elements.com/"
                >by Finder</a
                >
            </div>
        </div>
    )
}

export default Footer
