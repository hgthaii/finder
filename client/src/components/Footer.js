import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import logoWhite from '../../src/asset/image/FinderWhite.svg'
import logoBlack from '../../src/asset/image/FinderBlack.svg'

const Footer = ({ theme }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <div className="w-full  bg-main-200 text-white dark:bg-main-100 dark:text-main-300 ">
            <div className="  p-4 text-center">
                <div className="mb-6 flex justify-center  ">
                    {theme === 'dark' ? <img src={logoBlack} alt="logo" /> : <img src={logoWhite} alt="logo" />}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                    <div className="mb-6 cursor-pointer hover:underline decoration-red-400" onClick={() => navigate('contactus')}>
                        <span className="mb-2.5  uppercase">{t('ContactUs_footer')}</span>
                    </div>
                    <div className="mb-6 cursor-pointer hover:underline decoration-red-400" onClick={() => navigate('help')}>
                        <span className="mb-2.5  uppercase">{t('Help_footer')}</span>
                    </div>
                    <div className="mb-6 cursor-pointer hover:underline decoration-red-400" onClick={() => navigate('infomation')}>
                        <span className="mb-2.5  uppercase">{t('Infomation_footer')}</span>
                    </div>
                    <div className="mb-6 cursor-pointer hover:underline decoration-red-400" onClick={() => navigate('detailt')}>
                        <span className="mb-2.5  uppercase">{t('AboutFinder_footer')}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 text-center">© 2023 Copyright: by Finder</div>
        </div>
    )
}

export default Footer
