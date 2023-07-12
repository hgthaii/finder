import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

function VnpayReturnPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [result, setResult] = useState(null)

    const accessToken = localStorage.getItem('accessToken')
    const tokenBody = accessToken.split('.')[1]

    const decodedTokenBody = atob(tokenBody)
    const parsedTokenBody = JSON.parse(decodedTokenBody)

    const queryParams = new URLSearchParams(location.search)
    const vnp_Params = Object.fromEntries(queryParams.entries())
    const datePayment = vnp_Params.vnp_PayDate
    const datetime = moment(datePayment, 'YYYYMMDDHHmmss').utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss')

    const { t } = useTranslation()

    useEffect(() => {
        handleVnpayReturn(vnp_Params)
    }, [])

    const handleGoHome = () => {
        navigate('/')
    }
    const handleVnpayReturn = async (vnp_Params) => {
        if (vnp_Params.vnp_ResponseCode === '00') {
            try {
                const vnp_ParamsJSON = JSON.stringify(vnp_Params)
                await axios.post(
                    `${process.env.REACT_APP_API_URI}/payment`,
                    {
                        isVip: true,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            vnpay: vnp_ParamsJSON,
                        },
                    },
                )
                setResult(
                    <div>
                        <div className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity">
                                    <div className="absolute inset-0 bg-[#030014] opacity-100"></div>
                                </div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                                <div
                                    className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="modal-headline"
                                >
                                    <div>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                            <svg
                                                className="h-6 w-6 text-green-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <h3
                                                className="text-lg leading-6 font-medium text-gray-900 mb-3"
                                                id="modal-headline"
                                            >
                                                {t('PaymentSuccessful')}
                                            </h3>
                                            <div className="payment-details">
                                                <table className="border-collapse w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="py-2 pr-4 font-medium border-b text-left">
                                                                {t('PaymentAmount')}
                                                            </td>
                                                            <td className="py-2 pl-4 border-b text-left">
                                                                {vnp_Params.vnp_Amount / 100} VND
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 pr-4 font-medium border-b text-left">
                                                                {t('Bank')}
                                                            </td>
                                                            <td className="py-2 pl-4 border-b text-left">
                                                                {vnp_Params.vnp_BankCode}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 pr-4 font-medium border-b text-left">
                                                                {t('Payer')}
                                                            </td>
                                                            <td className="py-2 pl-4 border-b text-left">
                                                                {parsedTokenBody.infor.username}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 pr-4 font-medium border-b text-left">
                                                                {t('BankTransactionCode')}
                                                            </td>
                                                            <td className="py-2 pl-4 border-b text-left">
                                                                {vnp_Params.vnp_BankTranNo}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 pr-4 font-medium border-b text-left">
                                                                {t('PaymentMethod')}
                                                            </td>
                                                            <td className="py-2 pl-4 border-b text-left">
                                                                {vnp_Params.vnp_CardType}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-2 pr-4 font-medium text-left">
                                                                {t('PaymentTime')}
                                                            </td>
                                                            <td className="py-2 pl-4 text-left">{datetime}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <span className="flex w-full rounded-md shadow-sm">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                                onClick={handleGoHome}
                                            >
                                                {t('BackToHomepage')}
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                )
            } catch (error) {
                console.log('Failed to update payment status:', error)

                setResult(<p>{t('Failed')}</p>)
            }
        } else {
            setResult(<p>{t('Failed')}</p>)
        }
    }

    return <div>{result}</div>
}

export default VnpayReturnPage
