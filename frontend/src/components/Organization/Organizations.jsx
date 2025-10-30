import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../services/token';
import { Box, Input, VStack, Button, Heading, Container, Field, HStack, } from '@chakra-ui/react';
import {toaster} from "../../components/ui/toaster"
import axios from 'axios';
import { useNavigate } from 'react-router';

const Organizations = ({ onSuccess = () => {} }) => {
  const { t } = useTranslation();
  const { user, userInfo } = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "Finland",
    postal_code: "",
    email: "",
    website: "",
    owner: userInfo.id,
  });

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  const url = import.meta.env.VITE_ORGANIZATION_CREATE_URL;

  const ListOrganizations = async () => {
    try {
      const response = await axios.get(url, config);
      console.log("organization list data: ", response.data);
      const filterItem = response.data.filter((item) => item.owner === userInfo.id);
      setOrganizations(filterItem);
    } catch (error) {
      alert(t('admin_page.error_fetching_organizations'));
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'website') {
      if (value && !isValidURL(value)) {
        setErrors((prev) => ({ ...prev, website: t('admin_page.website_invalid') }));
      } else {
        setErrors((prev) => ({ ...prev, website: null }));
      }
    }
    if (name === 'email') {
      if (value && !isValidEmail(value)) {
        setErrors((prev) => ({ ...prev, email: t('register.email_invalid') }));
      } else {
        setErrors((prev) => ({ ...prev, email: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = {
      name: t('admin_page.name'),
      street: t('admin_page.street'),
      city: t('admin_page.city'),
      postal_code: t('admin_page.postal_code'),
    };
    for (const field in requiredFields) {
      if (!formData[field]) {
        alert(t('create_building_org.required_field', { field: requiredFields[field] }));
        return;
      }
    }
    try {
      const response = await axios.post(url, formData, config);
      onSuccess();
      toaster.success({
        title: t('create_building_org.building_created'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      ListOrganizations();
      console.log("Organization created:", response.data);
      setFormData({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        email: "",
        website: "",
        owner: userInfo.id,
      });
      navigate('/home/admin', { state: { shouldRefresh: true } });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.non_field_errors || err.response.data.name || t('admin_page.unknown_error');
        setErrors(errorMessage);
        toaster.create({
          title: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Unexpected error:", err);
        setErrors(t('admin_page.unexpected_error'));
        toaster.error({
          title: t('admin_page.unexpected_error'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    if (accessToken && userInfo?.id) {
      ListOrganizations();
    }
  }, [accessToken, userInfo?.id]);

  return (
    <Container justifyContent="center" maxW="500px">
      <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" m={4} p={4} rounded={8} minW="100%">
        <HStack w="100%" justifyContent="space-between">
          <Heading>{t('organization_details.create_new_organization')}</Heading>
        </HStack>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">
              {t('organization_details.name')}: <Field.RequiredIndicator />
            </Field.Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} />
          </HStack>
        </Field.Root>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">
              {t('organization_details.street')}: <Field.RequiredIndicator />
            </Field.Label>
            <Input type="text" name="street" value={formData.street} onChange={handleChange} />
          </HStack>
        </Field.Root>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">
              {t('organization_details.city')}: <Field.RequiredIndicator />
            </Field.Label>
            <Input type="text" name="city" value={formData.city} onChange={handleChange} />
          </HStack>
        </Field.Root>
        <Field.Root required>
          <HStack>
            <Field.Label w="200px">
              {t('organization_details.postal_code')}: <Field.RequiredIndicator />
            </Field.Label>
            <Input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} />
          </HStack>
        </Field.Root>
        <Field.Root>
          <HStack>
            <Field.Label w="200px">{t('organization_details.country')}:</Field.Label>
            <Input type="text" name="country" value={formData.country} onChange={handleChange} />
          </HStack>
        </Field.Root>
        <Field.Root>
          <HStack>
            <Field.Label w="200px">{t('organization_details.email')}:</Field.Label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('register_members.placeholder_email')}
            />
          </HStack>
        </Field.Root>
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        <Field.Root>
          <HStack>
            <Field.Label w="200px">{t('organization_details.website')}:</Field.Label>
            <Input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.example.com"
            />
          </HStack>
        </Field.Root>
        {errors.website && <p style={{ color: 'red' }}>{errors.website}</p>}
        <Button onClick={handleSubmit}>{t('organization_details.submit')}</Button>
      </VStack>
    </Container>
  );
};

export default Organizations;