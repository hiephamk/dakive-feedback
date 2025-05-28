import { Container, Center, Heading } from '@chakra-ui/react'
import React from 'react'

const NotFound = () => {
  return (
    <Container my={4}>
      <Center>
        <Heading>Page Not Found (404)</Heading>
      </Center>
    </Container>
  )
}

export default NotFound