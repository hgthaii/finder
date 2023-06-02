import React from 'react'
import Modals from 'react-modal'

import Modalcontainer from './Modalcontainer'

const Modal = ({ isOpenModal, closeModal, data }) => {
    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.05)',
            zIndex: 1000,
        },
        content: {
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            maxHeight: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            border: 'none',
            zIndex: 2000,
            backgroundColor: 'transparent',
        },
    }
    console.log('re-render')
    return (
        <Modals
            isOpen={isOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            scrollable={true}
        >
            <div className="animate-scaleUp ">
                <div className="relative min-w-[850px] flex items-center justify-center mt-[30px] z-50  ">
                    <Modalcontainer data={data} />
                </div>
            </div>
        </Modals>
    )
}

export default Modal
