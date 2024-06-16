import React from 'react';

import { Pagination, paginationClasses } from '@mui/material';
const Paging = ({handlePage,page}) => {
    return (
        <div className='bg-white h-[5vh] mb-6 flex justify-center'>
            <Pagination onChange={(event,value)=>{handlePage(value)}} page={page} count={500} shape='rounded'/>
        </div>
    );
}

export default Paging;
  