import { Box, Container, Heading, Link, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next';
import { LuExternalLink } from "react-icons/lu"

const About = () => {
  const { t } = useTranslation();
  return (
    <Container mt={20}>
      <Box p={8} borderWidth={1} borderRadius="md" boxShadow="md">
        <Heading>{t('aboutPage.heading_1')}</Heading>
        <Text mt={4}>{t('aboutPage.text_1')}</Text>
        <Heading mt={8}>{t('aboutPage.heading_2')}</Heading>
        <Text mt={4}>{t('aboutPage.text_2')}</Text>
        <Heading mt={8}>{t('aboutPage.heading_3')}</Heading>
        <Text mt={4}>{t('aboutPage.text_3')}</Text>
      </Box>
      <Box p={8} borderWidth={1} borderRadius="md" boxShadow="md" mt={"10px"} textAlign={"center"}>
        <Text mt={4} fontWeight="bold">
          {t('aboutPage.link_1_text')} {" "}
          {/* <a href="mailto: atte.partanen@hamk.fi">atte.partanen@hamk.fi</a> */}
          <Link href="mailto:atte.partanen@hamk.fi" color="teal.500" target="_blank" 
  rel="noopener noreferrer" external>
            atte.partanen@hamk.fi <LuExternalLink/>
          </Link>{" "}
        </Text>
        <Text mt={4} fontWeight="bold">{t('aboutPage.link_2_text')} {" "}
          <Link href="https://github.com/hiephamk/dakive-feedback/tree/main" target="_blank" 
  rel="noopener noreferrer" color="teal.500" external>Github <LuExternalLink/></Link>
        </Text>
      </Box>

    </Container>
  )
}

export default About