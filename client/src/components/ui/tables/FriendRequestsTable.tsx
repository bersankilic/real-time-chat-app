import React from "react";
import {Table, TableScrollContainer} from "@mantine/core";
import {IGetFriendRequest} from "../../../models/FriendRequestResponses";
import FriendRequestRow from "./FriendRequestRow";
import classes from "./FriendRequest.module.css";

const FriendRequestsTable: React.FC<{ fRequests: IGetFriendRequest[] }> = ({
  fRequests,
}) => {
  const rows = fRequests.map((fRequest) => (
    <FriendRequestRow key={fRequest.id} fRequest={fRequest} />
  ));

  return (
    <TableScrollContainer minWidth={300}>
      <Table
        className={classes.table}
        withColumnBorders={true}
        withRowBorders={true}
        verticalSpacing="sm"
        horizontalSpacing="lg"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Kullanıcı</Table.Th>
            <Table.Th>Tarih</Table.Th>
            <Table.Th>Ayarlar</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </TableScrollContainer>
  );
};

export default FriendRequestsTable;
