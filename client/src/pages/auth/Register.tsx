import {Link} from "react-router-dom";
import {
  Anchor,
  Button,
  Container,
  Loader,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {useForm} from "@mantine/form";
import {useAuth} from "../../hooks/useAuth";
import {RegisterForm} from "../../models/AuthForms";
import classes from "./AuthStyles.module.css";
import {useState} from "react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const form = useForm<RegisterForm>({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    },

    validate: {
      username: (value) => (/^\S+@\S+$/.test(value) ? null : "Geçersiz email"),
      confirmPassword: (value, formValues) =>
        formValues.password === value
          ? null
          : "Şifreniz eşleşmiyor !",
      nickname: (value) =>
        /\d/.test(value) ? "Takma adınızda sayı olamaz" : null,
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    setIsLoading(true);
    try {
      await register(values);
      notifications.show({
        title: "Kayıt başarılı !",
        message: "Giriş ekranına yönlendiriliyorsunuz...",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Kayıt işlemi başarısız !",
        message: "Lütfen tekrar deneyin...",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={classes.registerForm}>
      {isLoading && (
        <LoadingOverlay
          visible={true}
          loaderProps={{ children: <Loader color="blue" /> }}
        />
      )}
      <Container className={classes.registerContainer}>
        <Title ta="center" className={classes.title}>
          Kayıt sayfası
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Hesabınız var mı?{" "}
          <Anchor size="sm" component={Link} to="/">
            Giriş yap
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={15} radius="md">
          <form
            onSubmit={form.onSubmit((values: RegisterForm) => onSubmit(values))}
          >
            <TextInput
              label="E-mail"
              ta="left"
              placeholder="user@email.com"
              required
              {...form.getInputProps("username")}
            />
            <TextInput
              mt="md"
              label="Takma ad"
              ta="left"
              placeholder="Takma adınız"
              required
              {...form.getInputProps("nickname")}
            />
            <PasswordInput
              label="Şifre"
              placeholder="Şifreniz"
              ta="left"
              required
              mt="md"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Şifrenizi doğrulayın"
              placeholder="Şifreniz"
              ta="left"
              required
              mt="md"
              {...form.getInputProps("confirmPassword")}
            />

            <Button fullWidth mt="xl" type="submit">
              Kayıt ol
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
