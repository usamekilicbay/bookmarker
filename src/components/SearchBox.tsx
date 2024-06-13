import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";

export function SearchBox(props: {
  isActive: boolean;
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
          <IconButton
            aria-label={"Save page"}
            variant="ghost"
            icon={<HiSearch></HiSearch>}
            fontSize="large"
            textColor={props.isActive ? "purple.500" : "orangered"}
            transform={props.isActive ? "rotate(0Deg)" : "rotate(90Deg)"}
            _active={{
              backgroundColor: "inherit",
            }}
            _hover={{
              transform: "scale(1.5)",
              transition: "transform 0.3s ease-in-out",
            }}
          ></IconButton>
          {props.isActive && (
            <Input
              id="search_input"
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
          )}
        </Flex>
      </Box>
    </>
  );
}
