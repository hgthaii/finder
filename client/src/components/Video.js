import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
const styles = {
    width: '100%',
    height: '0px',
    position: 'relative',
    paddingBottom: '56.250%',
}
const styless = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: '0px',
    top: '0px',
    overflow: 'hidden',
}
const Video = () => {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, [])

    return (
        <>
            {isLoading ? (
                <div className="loading-wrapper absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                    <CircularProgress />
                </div>
            ) : (
                <div style={styles}>
                    <iframe
                        src="https://trailer.vieon.vn/Teaser_HBO_KeThuChung.mp4"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        allowFullScreen
                        style={styless}
                        title="video"
                    ></iframe>
                </div>
            )}
        </>
    )
}

export default Video
