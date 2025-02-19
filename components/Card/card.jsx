import React, { useEffect} from 'react'

function card ({ album }) {
    useEffect(() => {
        console.log('Album data: ', album)
    }, [album])

    const isNewRelease = new Date(album.release_date).getFullYear() === new Date().getFullYear()

    return (
        <div className="card w-full bg-base-100  shadow-xl">
            <figure>
                <img
                src={album.images[0].url} alt={album.name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {album.name}
                    {isNewRelease && (
                        <div className='badge badge-secondary'>New</div>
                    )}
                </h2>
                <p>{album.artists[0].name}</p>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                </div>
            </div>
        </div>
    )
}

export default card
