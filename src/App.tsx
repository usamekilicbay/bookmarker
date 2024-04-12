import { useCallback, useEffect, useState } from "react";
import "./App.css";
import SavedPage from "./components/SavedPage";
import SavePageTextBox from "./components/SavePageTextBox";
import { ISavedPage } from "./models/saved-page";
import Links from "./components/Links";
import { Box, Flex, List, useToast } from "@chakra-ui/react";
import Settings from "./components/Settings";
import { PAGE_SAVE_STORAGE_KEY } from "./common/constants";

const isDummyDataActive = true;

export default function App() {
  const [page, setPage] = useState<ISavedPage>();
  const [pages, setPages] = useState<ISavedPage[]>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isAutoDelete, setIsAutoDelete] = useState<boolean>(false);
  const toast = useToast();

  useCallback(() => {
    if (isDummyDataActive) {
      SeedDummyData();
    }
  }, [pages]);

  useEffect(() => {
    savePages();
  }, [pages]);

  useEffect(() => {
    if (pages.length === 0) {
      const tempPages: ISavedPage[] | undefined = loadSavedPages(
        PAGE_SAVE_STORAGE_KEY
      );

      if (tempPages) {
        setPages(tempPages);
      }
    }
    addPageToPagesList(page);
  }, [page]);

  function savePages(): void {
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
    let tempPage = pages.find((page) => page.id === pageId);
    if (tempPage && reminderText) {
      tempPage.reminderText = reminderText;
      setPage(tempPage);
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

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Links></Links>
          <Settings
            deleteAllSavedPages={deleteAllSavedPages}
            loadSavedPages={() => loadSavedPages(PAGE_SAVE_STORAGE_KEY)}
            importPages={importPages}
            getSavedPage={() => getSavedPage(crypto.randomUUID())}
            savedPages={pages}
            setIsAutoDelete={setIsAutoDelete}
          ></Settings>
        </Flex>
        <Box w="400px">
          <Box px={6}>
            <SavePageTextBox setPage={setPage}></SavePageTextBox>
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
            {pages
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
                  isAutoDelete={isAutoDelete}
                ></SavedPage>
              ))}
          </List>
        </Box>
      </Box>
    </>
  );

  function SeedDummyData(): void {
    const tempPages = Array(10)
      .fill(null)
      .map(
        (_, index) =>
          ({
            id: crypto.randomUUID(),
            reminderText: `Reminder text ${index}`,
            saveDate: new Date(),
            title: `Title ${index}`,
            url: `https://www.example.com/dummy-page-${index}`,
          } as ISavedPage)
      );

    console.log(pages);
    setPages([...pages, ...tempPages]);
  }
}
