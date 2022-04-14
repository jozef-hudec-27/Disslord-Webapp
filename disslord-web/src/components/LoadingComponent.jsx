import React from 'react'
import { Spinner } from '@chakra-ui/react'

const LoadingComponent = ({ size, mt }) => {
    return (
            <div align='center'>
                <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='purple.500'
                size={size ? size : 'xl'}
                mt={mt ? mt : '250'}
                />
            </div>
        )
}

export default LoadingComponent