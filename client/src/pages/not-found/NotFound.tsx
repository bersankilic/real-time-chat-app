import {Button, Container, Group, Text, Title} from "@mantine/core";
import {Link} from "react-router-dom";
import classes from "./NotFound.module.css";

const NotFound = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Sayfa bulunamadı.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          Aradığınız sayfa bulunamadı.
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md" component={Link} to="/home">
          Anasayfa
        </Button>
      </Group>
    </Container>
  );
};

export default NotFound;
