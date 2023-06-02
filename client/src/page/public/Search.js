import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Section, Modal } from '../../components'
const Search = () => {
    const { searchData } = useSelector((state) => state.app)
    console.log(searchData)

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const openModal = (movies) => {
        setSelectedProduct(movies)
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }
    return (
        <div className="mt-[80px] flex flex-wrap w-full px-[48px] ">
            {searchData &&
                searchData?.map((item) => (
                    <div key={item?.id} className="pt-[34px]">
                        <Section height={136} data={item} openModal={openModal} className="w-[25%] rounded-lg " />
                        <Modal isOpenModal={modalIsOpen} closeModal={closeModal} data={selectedProduct} />
                    </div>
                ))}
        </div>
    )
}

export default Search
