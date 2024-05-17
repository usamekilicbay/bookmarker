import { useEffect, useState } from "react";
import "./App.css";
import SavedPage from "./components/SavedPage";
import SavePageTextBox from "./components/SavePageTextBox";
import { ISavedPage } from "./models/saved-page";
import Links from "./components/Links";
import {
  Box,
  Flex,
  IconButton,
  List,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import Settings from "./components/Settings";
import { PAGE_SAVE_STORAGE_KEY } from "./common/constants";
import { DUMMY_DATA_COUNT } from "./common/dev-constants";
import { SettingsContext } from "./contexts/settings-context";
import { loadSettings, saveSettings } from "./services/settings-service";
import { SearchBox } from "./components/SearchBox";
import { HiPlus, HiSearch } from "react-icons/hi";

export default function App() {
  const [page, setPage] = useState<ISavedPage>();
  const [pages, setPages] = useState<ISavedPage[]>([]);
  const [shownPages, setShownPages] = useState<ISavedPage[]>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [settings, setSettings] = useState<ISettings>();
  const [searchBoxToggle, setSearchBoxToggle] = useBoolean(false);

  const toast = useToast();

  useEffect(() => {
    const tempSettings = loadSettings();
    setSettings(tempSettings);
  }, []);

  useEffect(() => {
    if (settings && settings !== loadSettings()) {
      saveSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    savePages();
    setShownPages(pages);

    if (pages.length > 0) return;

    const tempPages = loadSavedPages(PAGE_SAVE_STORAGE_KEY);
    if (tempPages) {
      setPages(tempPages);
    }
  }, [pages]);

  useEffect(() => {
    addPageToPagesList(page);
  }, [page]);

  function savePages(): void {
    // TODO: reconsider isDelete usage
    if (isDelete || pages.length > 0) {
      window.localStorage.setItem(PAGE_SAVE_STORAGE_KEY, JSON.stringify(pages));
      setIsDelete(false);
    }
  }

  function addPageToPagesList(page: ISavedPage | undefined) {
    if (page && page.id && page.url && page.title && page.reminderText) {
      const existingPageIndex = pages.findIndex((p) => p.id === page.id);
      const updatedPages =
        existingPageIndex !== -1
          ? [
              ...pages.slice(0, existingPageIndex),
              page,
              ...pages.slice(existingPageIndex + 1),
            ]
          : [...pages, page];
      setPages(updatedPages);

      if (existingPageIndex === -1) {
        toast({
          title: "New page added",
          description: `There are ${updatedPages.length} saved pages in total`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }

  function loadSavedPages(storageKey: string): ISavedPage[] | undefined {
    const value = window.localStorage.getItem(storageKey);
    if (value) {
      const tempPages: ISavedPage[] = JSON.parse(value) as ISavedPage[];
      if (tempPages) {
        return tempPages;
      }
      toast({
        title: "Format error!",
        description: "Pages could not be retrieved",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    toast({
      title: "There are no saved pages yet",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  }

  function getSavedPage(id: string): ISavedPage | undefined {
    const pages = loadSavedPages(PAGE_SAVE_STORAGE_KEY);
    if (pages) {
      return pages.find((page) => page.id === id);
    }
    toast({
      title: "Page could not be retrieved",
      description: "There is no page with the specified id!",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  function updatePage(pageId: string, reminderText: string) {
    const originalPage = pages.find((page) => page.id === pageId);
    if (originalPage && reminderText) {
      const updatedPage = { ...originalPage, reminderText: reminderText };
      setPage(updatedPage);
    }
  }

  function deletePage(id: string) {
    setIsDelete(true);
    let tempPages: ISavedPage[] = [...pages];
    tempPages = tempPages.filter((p) => p.id !== id);
    setPages(tempPages);

    toast({
      title: "Page deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }

  const deleteAllSavedPages = () => {
    setIsDelete(true);
    setPages([]);

    toast({
      title: "All pages are deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  function importPages(file: File): void {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e) => {
      try {
        const tempPages: ISavedPage[] = JSON.parse(
          e.target?.result as string
        ) as ISavedPage[];
        if (tempPages) {
          setPages(tempPages);
        }
      } catch (error) {
        toast({
          title: "Import failed",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
  }

  function searchPages(searchText: string | undefined): void {
    if (!searchText) {
      setShownPages(pages);
      return;
    } else if (searchText.length < 3) {
      return;
    }

    const searchRegex = new RegExp(searchText, "i");
    const filteredPages = pages.filter(
      (x) =>
        searchRegex.test(x.reminderText) ||
        searchRegex.test(x.title) ||
        searchRegex.test(x.url)
    );

    filteredPages.sort((a, b) => a.saveDate.getTime() - b.saveDate.getTime());
    filteredPages.reverse();
    setShownPages(filteredPages);
  }

  if (!settings) return;

  return (
    <>
      <SettingsContext.Provider value={settings}>
        <Box>
          <Flex justify="space-between" align="center">
            <Links></Links>
            <Settings
              setSettings={setSettings}
              deleteAllSavedPages={deleteAllSavedPages}
              loadSavedPages={() => loadSavedPages(PAGE_SAVE_STORAGE_KEY)}
              importPages={importPages}
              getSavedPage={() => getSavedPage(crypto.randomUUID())}
              savedPages={pages}
              seedDummyPages={() => SeedDummyPages(pages)}
              removeDummyPages={RemoveDummyPages}
            ></Settings>
          </Flex>
          <Box w="400px">
            <Flex mx={150}>
              <Flex
                justifyContent="end"
                transition="flex 0.3s ease-in-out" // Set transition for flex
                flex={searchBoxToggle ? 1 : 0}
              >
                <IconButton
                  aria-label="Search Box/Reminder Text Save Toggle"
                  onClick={setSearchBoxToggle.toggle}
                  icon={
                    searchBoxToggle ? <HiPlus></HiPlus> : <HiSearch></HiSearch>
                  }
                  variant="ghost"
                  textColor="orange.500"
                  _hover={{
                    textColor: "purple.500",
                    transform: "rotate(90Deg)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                ></IconButton>
              </Flex>
            </Flex>
            <Box px={6}>
              {searchBoxToggle ? (
                <SearchBox search={searchPages}></SearchBox>
              ) : (
                <SavePageTextBox setPage={setPage}></SavePageTextBox>
              )}
            </Box>
            <List
              spacing={2}
              py={1}
              px={6}
              h="280px"
              overflowY="auto" // Use overflowY="auto" for smooth scrolling
              sx={{
                "&:hover": {
                  // Show scrollbar on hover over container
                  "&::-webkit-scrollbar": {
                    backgroundColor: `rgba(0, 0, 0, 0.03)`,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: `rgba(0, 0, 0, 0.3)`, // Adjust thumb color
                  },
                },
                "&::-webkit-scrollbar": {
                  width: "5px",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                },
              }}
            >
              {shownPages
                .slice()
                .reverse()
                .map((page) => (
                  <SavedPage
                    key={page.id}
                    incomingPage={{
                      id: page.id,
                      url: page.url,
                      title: page.title,
                      reminderText: page.reminderText,
                      saveDate: page.saveDate,
                    }}
                    deletePage={() => deletePage(page.id)}
                    updatePage={(editedReminderText: string) =>
                      updatePage(page.id, editedReminderText)
                    }
                  ></SavedPage>
                ))}
            </List>
          </Box>
        </Box>
      </SettingsContext.Provider>
    </>
  );

  function SeedDummyPages(pages: ISavedPage[]): void {
    // const requiredDummyDataCount = Math.max(0, DUMMY_DATA_COUNT - pages.length);
    // const tempPages = Array(requiredDummyDataCount)
    const tempPages = Array(DUMMY_DATA_COUNT)
      .fill(null)
      .map(
        (_, index) =>
          ({
            id: crypto.randomUUID(),
            reminderText: `Reminder text ${index}`,
            saveDate: new Date(),
            title: `Dummy ${index}`,
            url: `https://www.example.com/dummy-page-${index}`,
          } as ISavedPage)
      );

    console.log(pages);
    setPages([...pages, ...tempPages]);

    toast({
      title: "Dummy pages added",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }

  function RemoveDummyPages(): void {
    setIsDelete(true);
    let tempPages: ISavedPage[] = [...pages];
    tempPages = tempPages.filter((p) => !p.title.includes("Dummy"));
    setPages(tempPages);

    toast({
      title: "DummyPages deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }
}
