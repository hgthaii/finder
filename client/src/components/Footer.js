import React from 'react'

import logo from '../../src/asset/image/logo.png'

const Footer = () => {
    return (
        <footer class="bg-[#030014] text-center text-white">
            <div class="container px-6 pt-6 m-0">
                <div class="mb-6 flex justify-center">
                    <img src={logo} alt="logo" />
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-4">
                    <div class="mb-6">
                        <span class="mb-2.5  uppercase">Chính sách bảo mật</span>
                    </div>
                    <div class="mb-6">
                        <span class="mb-2.5  uppercase">Giúp đỡ</span>
                    </div>
                    <div class="mb-6">
                        <span class="mb-2.5  uppercase">Thiết bị hỗ trợ</span>
                    </div>
                    <div class="mb-6">
                        <span class="mb-2.5  uppercase">Về Finder</span>
                    </div>
                </div>
            </div>

            <div
                class="p-4 text-center"
            >
                © 2023 Copyright:
                <a class="text-white" href="https://tailwind-elements.com/"
                >by Finder</a
                >
            </div>
        </footer>
    )
}

export default Footer
