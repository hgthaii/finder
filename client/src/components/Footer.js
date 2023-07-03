import React from 'react'
import { useTranslation } from 'react-i18next'

import logoWhite from '../../src/asset/image/FinderWhite.svg'
import logoBlack from '../../src/asset/image/FinderBlack.svg'

const Footer = ({ theme }) => {
    const { t } = useTranslation()
    return (
        <div className="w-full  bg-main-200 text-white dark:bg-main-100 dark:text-main-300 ">
            <div className="  p-4 text-center">
                <div className="mb-6 flex justify-center  ">
                    {theme === 'dark' ? <img src={logoBlack} alt="logo" /> : <img src={logoWhite} alt="logo" />}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">{t('PrivacyPolicy_footer')}</span>
                    </div>
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">{t('Help_footer')}</span>
                    </div>
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">{t('SupportedDevices_footer')}</span>
                    </div>
                    <div className="mb-6">
                        <span className="mb-2.5  uppercase">{t('AboutFinder_footer')}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 text-center">© 2023 Copyright: by Finder</div>
        </div>
    )
}

export default Footer
