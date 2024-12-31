import {useState} from "react";
import {Autocomplete, rem} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";
import {useFriends} from "../../../../../hooks/useFriends";
import classes from "../Header.module.css";

const SearchBar = () => {
  const { searchUser } = useFriends();
  const [searchPrefix, setSearchPrefix] = useState<string>("");

  const onChangeSearch = (value: string) => {
    setSearchPrefix(value);
  };
  const onSearch = async () => {
    try {
      const res = await searchUser(searchPrefix);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Autocomplete
      className={classes.searchBar}
      value={searchPrefix}
      onChange={onChangeSearch}
      placeholder="Kullanıcı ara..."
      leftSection={
        <IconSearch
          onClick={onSearch}
          cursor="pointer"
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      }
      visibleFrom="xs"
    />
  );
};

export default SearchBar;
