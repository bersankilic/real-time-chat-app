import {modals} from "@mantine/modals";
import {Button, rem, Text} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import {useAuth} from "../../../hooks/useAuth";
import {notifications} from "@mantine/notifications";

const DeleteAccountModal = () => {
  const { deleteUser } = useAuth();
  const onDeleteAccount = async () => {
    try {
      await deleteUser();
      notifications.show({
        title: "Hesap silindi!",
        message: "Hesabınız başarıyla silindi...",
        autoClose: 3000,
      });
    } catch (error) {
      notifications.show({
        title: "Hesabınızı silerken bir hata oluştu...",
        message: "Lütfen tekrar deneyin...",
        color: "red",
      });
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Profilini sil.",

      children: (
        <Text size="sm">
            Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri
            alınamaz...
        </Text>
      ),
      labels: { confirm: "Hesabı sil", cancel: "Vazgeç" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: onDeleteAccount,
    });
  return (
    <Button
      color="red"
      onClick={openDeleteModal}
      leftSection={
        <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      }
    >
      Hesabı sil
    </Button>
  );
};

export default DeleteAccountModal;
