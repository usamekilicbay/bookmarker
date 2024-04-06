import { useEffect, useState } from "react";
import "./App.css";
import SavedPage from "./components/SavedPage";
import SavePageTextBox from "./components/SavePageTextBox";
import { ISavedPage } from "./models/saved-page";
import Links from "./components/Links";
import { Box, Flex, List, useToast } from "@chakra-ui/react";
import Settings from "./components/Settings";
import { PAGE_SAVE_STORAGE_KEY } from "./common/constants";

const isDummyDataActive = false;

export default function App() {
  const [page, setPage] = useState<ISavedPage>();
  const [pages, setPages] = useState<ISavedPage[]>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isAutoDelete, setIsAutoDelete] = useState<boolean>(false);
  const toast = useToast();

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

      toast({
        title: "New page added",
        description: `There are ${updatedPages.length} saved pages in total`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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

  function editPage(pageId: string, reminderText: string) {
    let page = pages.find((page) => page.id === pageId);
    if (page && reminderText) {
      page.reminderText = reminderText;
      setPage(page);
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
          <Box ps={6}>
            <SavePageTextBox setPage={setPage}></SavePageTextBox>
          </Box>
          <List
            spacing={2}
            pt={2}
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
                // Set width to 10px permanently
                width: "5px",
                borderRadius: "8px",
                backgroundColor: "transparent", // Ensure scrollbar is truly hidden (unchanged)
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "8px",
                backgroundColor: "transparent", // Ensure scrollbar is truly hidden (unchanged)
              },
            }}
          >
            {isDummyDataActive && dummyData()}
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
                  editPage={(editedReminderText: string) =>
                    editPage(page.id, editedReminderText)
                  }
                  isAutoDelete={isAutoDelete}
                ></SavedPage>
              ))}
          </List>
        </Box>
      </Box>
    </>
  );

  function dummyData() {
    return [...Array(10)].map((_, index) => (
      <SavedPage
        key={`page-${index + 1}`}
        incomingPage={{
          id: `page-${index + 1}`,
          url: `https://www.example.com/dummy-page-${index + 1}`,
          title: `Dummy Saved Page ${index + 1}`,
          reminderText: `This is a reminder for page ${index + 1}`,
          saveDate: new Date(),
        }}
        deletePage={() =>
          console.log("Delete Page with ID:", `page-${index + 1}`)
        }
        editPage={(editedReminderText: string) =>
          console.log(
            "Edit Page with ID:",
            `page-${index + 1}`,
            ", New Reminder Text:",
            editedReminderText
          )
        }
        isAutoDelete={isAutoDelete}
      />
    ));
  }
}
