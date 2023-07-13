import { useSelector } from 'react-redux'
import { Section } from '../../components'
import { Outlet } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';

const Search = () => {
    const { searchData } = useSelector((state) => state.app)
    return (
        <div className=" mt-[100px]">
            {searchData ? <div className="flex flex-wrap w-full">
                {searchData?.map((item) => (
                    <div key={item?._id} className="w-[50%]  min-[1024px]:w-[20%] rounded-lg mt-2 px-1">
                        <Section data={item} />
                    </div>

                ))}
            </div> : <div className="relative top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-main-200">
                <CircularProgress />
            </div>}
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Search
