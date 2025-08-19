import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { getAuthUser } from '../lib/api'

const useAuthUser = () => {
  const authUser = useQuery({   // here authData is used to rename the data 
    queryKey:["authUser"],
  
    queryFn: getAuthUser,
  
    retry:false // this makes it not to refresh it 3 times as default this tanstack refresh anyroute 3 times if there is an error 
  })
  
  return {isloading :authUser.isLoading , authUser : authUser.data?.user}
}

export default useAuthUser
