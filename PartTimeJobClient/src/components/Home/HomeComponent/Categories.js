import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Category from './Category'
import { getListJobTypeAndCountPost } from '../../../service/userService'

const Categories = () => {
    const [allCategory, setAllCategory] = useState([])
    useEffect( () => {
        // async function something(params) {
        //     let res = await getListJobTypeAndCountPost(
        //         {
        //             limit: 6,
        //             offset: 0
        //         }
        //     )
        //     if (res.errCode === 0)
        //         setAllCategory(res.data)
        //     else
        //         toast.error(res.message)
        // }
        // something();
    }, [])
    console.log(allCategory)
    return (
        <>
            <div class="row d-flex justify-contnet-center">
                {
                    allCategory.map((data, index) => {
                        return <Category data={data} key={index} />
                    })
                }

            </div>
        </>
    )
}

export default Categories
