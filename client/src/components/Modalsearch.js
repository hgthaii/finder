import React, { useState } from 'react'
import Modals from 'react-modal'

const Modalsearch = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSearchValue('')
    }

    const handleChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        if (value !== '') {
            openModal()
        } else {
            closeModal()
        }
    }

    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'red',
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
            // backgroundColor: 'red'
        },
    }
    return (
        <Modals
            // isOpen={isOpenModal}
            // onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            scrollable={true}
        ></Modals>
    )
}

export default Modalsearch
