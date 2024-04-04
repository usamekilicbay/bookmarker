import { useEffect, useState } from "react";
import "./App.css";
import SavedPage from "./components/SavedPage";
import SavePageTextBox from "./components/SavePageTextBox";
import { SavedPageModel } from "./models/saved-page";
import Links from "./components/Links";
import { Box, Flex, List, useToast } from "@chakra-ui/react";
import Settings from "./components/Settings";
import { STORAGE_KEY } from "./common/constants";

const isDummyDataActive = true;

export default function App() {
  const [page, setPage] = useState<SavedPageModel>();
  const [pageList, setPageList] = useState<SavedPageModel[]>([]);
  const toast = useToast();

  useEffect(() => {
    savePages();
  }, [pageList]);

  useEffect(() => {
    if (pageList.length == 0) {
      const tempPages: SavedPageModel[] | undefined =
        loadSavedPages(STORAGE_KEY);
      if (tempPages) {
        setPageList(tempPages);
      }
    }
    addPageToPagesList(page);
  }, [page]);

  const savePages = () => {
    if (pageList.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pageList));
    }
  };

  function addPageToPagesList(page: SavedPageModel | undefined) {
    if (page && page.id && page.url && page.title && page.reminderText) {
      const existingPageIndex = pageList.findIndex((p) => p.id === page.id);
      const updatedPages =
        existingPageIndex !== -1
          ? [
              ...pageList.slice(0, existingPageIndex),
              page,
              ...pageList.slice(existingPageIndex + 1),
            ]
          : [...pageList, page];
      setPageList(updatedPages);

      toast({
        title: "New page added",
        description: `There are ${updatedPages.length} saved pages in total`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  function loadSavedPages(storageKey: string): SavedPageModel[] | undefined {
    const value = window.localStorage.getItem(storageKey);
    if (value) {
      const pages: SavedPageModel[] = JSON.parse(value) as SavedPageModel[];
      if (pages) {
        return pages;
      }
      toast({
        title: "Pages could not be retrieved",
        description: "There are no saved pages!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    toast({
      title: "Pages could not be retrieved",
      description: "There are no saved pages!",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  function getSavedPage(id: string): SavedPageModel | undefined {
    const pages = loadSavedPages(STORAGE_KEY);
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
    let page = pageList.find((page) => page.id === pageId);
    if (page && reminderText) {
      page.reminderText = reminderText;
      setPage(page);
    }
  }

  function deletePage(pageId: string) {
    let tempPages: SavedPageModel[] = [...pageList];
    tempPages = tempPages.filter((p) => p.id !== pageId);
    setPageList(tempPages);

    toast({
      title: "Page deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }

  const deleteAllSavedPages = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setPageList([]);

    toast({
      title: "All pages are deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Links></Links>
          <Settings
            deleteAllSavedPages={deleteAllSavedPages}
            getSavedPage={() => getSavedPage(crypto.randomUUID())}
            loadSavedPages={() => loadSavedPages(STORAGE_KEY)}
            savedPages={pageList}
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
            {pageList
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
      />
    ));
  }
}
