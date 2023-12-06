import { Box, Flex, Text, Link } from '@chakra-ui/react';

export default function Footer() {
    const linkedinProfile = 'https://www.linkedin.com/in/sheldon-pierce/'
    return (
        <>
            <Box
      as="footer"
      p="4"
      bgColor="gray.800"
      color="white"
      textAlign="center"
    >
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="sm">
          &copy; 2023 M.A Handyman Services. All rights reserved. Designed by{' '}
          <Link href={linkedinProfile} isExternal>
            Sheldon Pierce
          </Link>
        </Text>
      </Flex>
    </Box>
        </>
    )
}