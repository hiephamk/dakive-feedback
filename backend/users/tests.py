from django.test import TestCase
from django.contrib.auth import get_user_model

from backend.users.management import CustomUserManager


class CustomUserManagerTests(TestCase):

    def test_create_user_is_owner(self):
        # Create the user
        user = CustomUserManager().create_user(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password="password123",
            is_owner=True  # Make the user an owner
        )

        # Validate the user is created correctly
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")
        self.assertEqual(user.email, "john.doe@example.com")
        self.assertTrue(user.is_owner)  # Check that the user is an owner
        self.assertTrue(user.check_password("password123"))  # Check that the password is correctly set
