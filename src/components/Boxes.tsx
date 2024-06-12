import { Flex, useBoolean } from "@chakra-ui/react";
import SavePageTextBox from "./SavePageTextBox";
import { SearchBox } from "./SearchBox";
import { ISavedPage } from "../models/saved-page";
import { useRef, useEffect } from "react";
import { SEARCH_SAVE_TOGGLE_KEY } from "../common/key-constans";

export function Boxes(props: {
  searchPages: (searchText: string | undefined) => void;
  setPage: (page: ISavedPage) => void;
}) {
  const [searchBoxToggle, setSearchBoxToggle] = useBoolean(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === SEARCH_SAVE_TOGGLE_KEY) {
      setSearchBoxToggle.toggle();
    }
  };
  const keyDownRef = useRef(handleKeyDown);

  useEffect(() => {
    document.addEventListener("keydown", keyDownRef.current);

    return () => document.removeEventListener("keydown", keyDownRef.current);
  }, []);

  return (
    <>
      <Flex px={6}>
        <Flex
          display="inline-block"
          transition="flex 0.5s ease-in-out"
          flex={searchBoxToggle ? 1 : 0}
          onMouseEnter={setSearchBoxToggle.on}
        >
          <SearchBox
            isActive={searchBoxToggle}
            search={props.searchPages}
          ></SearchBox>
        </Flex>
        <Flex
          display="inline-block"
          transition="flex 0.5s ease-in-out"
          flex={searchBoxToggle ? 0 : 1}
          onMouseEnter={setSearchBoxToggle.off}
        >
          <SavePageTextBox
            isActive={!searchBoxToggle}
            setPage={props.setPage}
          ></SavePageTextBox>
        </Flex>
      </Flex>
    </>
  );
}
