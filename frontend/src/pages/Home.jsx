import { Box, Heading, QrCode } from '@chakra-ui/react'
import React from 'react'

const Home = () => {
  return (
    <Box mt={20}>
      <Heading>Feedback Application</Heading>
      <Box>
        <QrCode.Root value="https://www.hamk.fi/en/projects/dakive-data-utilization-for-the-development-of-energy-efficiency-and-low-carbon-of-the-real-estate/">
          <QrCode.Frame>
            <QrCode.Pattern />
          </QrCode.Frame>
        </QrCode.Root>
      </Box>
    </Box>
  )
}

export default Home