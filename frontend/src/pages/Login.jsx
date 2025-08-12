
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { login, reset, getUserInfo } from '../services/authSlice';
import { Center, Button, Container, Box, Heading, Input, Text, VStack, HStack, Flex } from "@chakra-ui/react";
import { PasswordInput } from "../components/ui/password-input";
import LanguageSelector from "../components/Languague/LanguageSelector";

const Login = () => {
  const { t } = useTranslation();
  const { user, isError, isSuccess } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    "email": "",
    "password": "",
  });
  const [error, setError] = useState('');
  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      setError(t('error.invalid_credentials'));
    }

    if (isSuccess) {
      dispatch(getUserInfo());
      navigate("/home");
    }

    dispatch(reset());

  }, [isError, isSuccess, user, email, navigate, dispatch, t]);

  return (
    <Container maxW="1140px">
      <Center flexBasis="50%">
        <VStack maxW="500px" mt={100} rounded={8} p={8} border="1px solid" shadow="3px 3px 15px 5px rgb(75, 75, 79)">
          <HStack gap={"20px"}>
            <Heading fontSize={24}>{t('login.heading')}</Heading>
            <LanguageSelector/>
          </HStack>
          {error && (
            <Box
              border="1px solid"
              borderColor="red.500"
              bg="red.100"
              color="red.800"
              p={3}
              rounded={8}
              mb={4}
            >
              {error}
            </Box>
          )}
      
          <VStack p={4} rounded={8}>
            <Input
              border="1px solid"
              type="text"
              placeholder={t('login.email')}
              name="email"
              onChange={handleChange}
              value={email}
              required
            />
            <PasswordInput
              border="1px solid" my={2}
              placeholder={t('login.password')}
              size="lg"
              onChange={handleChange}
              value={password}
              name="password"
              required
            />
            <Button type="submit" onClick={handleSubmit}>{t('login.button')}</Button>
          </VStack>
          <Text>{t('login.forgot_password')} <Link to="/reset-password">{t('login.reset_password')}</Link></Text>
          <Text>{t('login.no_account')}
            <Link to="/register">
              {t('login.sign_up')}
            </Link>
          </Text>
        </VStack>
      </Center>
    </Container>
  );
};

export default Login;

