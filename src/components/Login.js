import { useForm } from "react-hook-form";
import {
  VStack,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const { username, password } = data;
  
    if (username === "dummyUser" && password === "dummyPassword") {
      console.log("Login successful!");
      navigate("/sale-order-management");
    } else {
      console.log("Invalid username or password");
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" bg="gray.400">
      <Box maxW="md" mx="auto" p={8} rounded="md" shadow="md" bg="white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={errors.username}>
              <FormLabel htmlFor="username">Username:</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required",
                  maxLength: {
                    value: 20,
                    message: "Maximum length allowed: 20 characters",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password:</FormLabel>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  maxLength: {
                    value: 16,
                    message: "Maximum length allowed: 16 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]*$/,
                    message: "Password can only contain alphabets and numbers",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
