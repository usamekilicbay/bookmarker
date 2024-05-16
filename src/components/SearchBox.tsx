import { Box, Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";

export function SearchBox(props: {
  search: (searchText: string | undefined) => void;
}) {
  const [searchText, setSearchText] = useState<string>();

  useEffect(() => {
    props.search(searchText);
  }, [searchText]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <Box id="search_box" marginY={5}>
        <Flex>
          <Input
            variant="flushed"
            placeholder="Enter something to search"
            focusBorderColor="purple.500"
            errorBorderColor="crimson"
            onChange={onChange}
            boxShadow="lg"
            paddingX={2}
            autoFocus
            value={searchText}
          />
          <Box w="max" mx={2.5} my="auto" fontSize="larger" color="purple.500">
            <HiSearch></HiSearch>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
