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
import classes from "./AuthStyles.module.css";
import {LoginForm} from "../../models/AuthForms";
import {useAuth} from "../../hooks/useAuth";
import {useState} from "react";

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const onSubmit = async (values: LoginForm) => {
    setIsLoading(true);
    try {
      await login(values);
      notifications.show({
        title: "Uygulamaya hoşgeldiniz!",
        message: "Ana sayfaya yönlendiriliyorsunuz",
        autoClose: 1500,
      });
    } catch (error) {
      notifications.show({
        title: "Giriş başarısız!",
        message: "Bilgilerinizi kontrol edip tekrar deneyiniz",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.loginForm}>
      {isLoading && (
        <LoadingOverlay
          visible={true}
          loaderProps={{ children: <Loader color="blue" /> }}
        />
      )}
      <Container className={classes.loginContainer}>
        <Title ta="center" className={classes.title}>
          Giriş sayfası
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Henüz hesabınız yok mu?{" "}
          <Anchor size="sm" component={Link} to="/register">
            <br/>
            Hesap oluştur
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form
            onSubmit={form.onSubmit((values: LoginForm) => onSubmit(values))}
          >
            <TextInput
              label="E-posta"
              ta="left"
              placeholder="user@email.com"
              required
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label="Şifre"
              placeholder="Şifreniz"
              ta="left"
              required
              mt="md"
              {...form.getInputProps("password")}
            />

            <Button fullWidth mt="xl" type="submit">
              Giriş yap
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
