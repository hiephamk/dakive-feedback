import React from 'react'
import { Box, Container, QrCode, VStack, Flex } from '@chakra-ui/react'

const Feedback = () => {
  return (
    <Container maxW="1440px">
        <VStack width="100%" gap={2}>
            <Box>
                <QrCode.Root value="https://www.hamk.fi/en/projects/dakive-data-utilization-for-the-development-of-energy-efficiency-and-low-carbon-of-the-real-estate/">
                <QrCode.Frame>
                    <QrCode.Pattern />
                </QrCode.Frame>
                </QrCode.Root>
            </Box>
            <Box>
                Feedback form
            </Box>
        </VStack>
    </Container>
  )
}

export default Feedback