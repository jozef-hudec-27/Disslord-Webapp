import React from 'react'
import { Box, Text } from '@chakra-ui/react'
 

const ListElements = ({ width, float, align, titleOptions: { as, fontWeight, fontSize, alignTitle, ml, color, mt }, title,
                        bool, boolTrueDisplay, boolFalseDisplay, divide }) => (
        <Box align={align} style={{ float: float, width: width }}>
            <Text as={as} 
                  fontWeight={fontWeight}
                  fontSize={fontSize}
                  alignTitle={alignTitle}
                  ml={ml} mt={mt}
                  color={color}
                  >{title}</Text>
            {divide && <hr width='75%' />}
            {bool ? boolTrueDisplay : boolFalseDisplay}
        </Box>
)

export default ListElements