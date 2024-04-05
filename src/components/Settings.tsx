import {
  Box,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  HiOutlineCog,
  HiOutlineDownload,
  HiOutlineUpload,
  HiOutlineTrash,
} from "react-icons/hi";
import { HiMagnifyingGlass, HiOutlineArrowPath } from "react-icons/hi2";
import { SavedPageModel } from "../models/saved-page";
import saveAs from "file-saver";
import { STORAGE_KEY } from "../common/constants";

export default function Settings(props: {
  deleteAllSavedPages: () => void;
  loadSavedPages: (storageKey: string) => void;
  getSavedPage: (id: string) => SavedPageModel | undefined;
  savedPages: SavedPageModel[];
}) {
  const toast = useToast();

  const handleExportData = () => {
    const jsonData = JSON.stringify(props.savedPages, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    // TODO: update file name for saving
    saveAs(blob, "bookmark-saved-pages.json");

    toast({
      title: "Data exportded successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // TODO: update the method
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    console.log("import data");
    //      const file = event.target.files[0];
    //      // Check for valid JSON file
    //      if (file && file.type === "application/json") {
    //        readFileContent(file);
    //      } else {
    //        // Handle invalid file type
    //      }
    //    };

    toast({
      title: "Data imported successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const onLoadSavedPages = () => {
    props.loadSavedPages(STORAGE_KEY);

    toast({
      title: "Pages loaded successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <Popover placement="left-start">
        <PopoverTrigger>
          <IconButton
            aria-label="Settings"
            icon={<HiOutlineCog></HiOutlineCog>}
            variant="ghost"
            textColor="orange.500"
            _hover={{
              textColor: "purple.500",
              transform: "rotate(90Deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          bg="orange.50"
          borderColor="orange.500"
          w="50px"
          rounded="md"
          p={1}
        >
          <Box>
            <VStack>
              <Tooltip label="Reload saved pages" placement="left" hasArrow>
                <IconButton
                  aria-label={"Reload saved pages"}
                  variant="ghost"
                  onClick={onLoadSavedPages}
                  icon={<HiOutlineArrowPath></HiOutlineArrowPath>}
                ></IconButton>
              </Tooltip>
              <Tooltip label="Get saved page" placement="left" hasArrow>
                <IconButton
                  aria-label={"Get saved page"}
                  variant="ghost"
                  onClick={() => props.getSavedPage(crypto.randomUUID())}
                  icon={<HiMagnifyingGlass></HiMagnifyingGlass>}
                ></IconButton>
              </Tooltip>
              <Tooltip
                label="Export saved pages as JSON"
                placement="left"
                hasArrow
              >
                <IconButton
                  aria-label={"Export saved pages as JSON"}
                  variant="ghost"
                  onClick={handleExportData}
                  icon={<HiOutlineDownload></HiOutlineDownload>}
                ></IconButton>
              </Tooltip>
              <Tooltip label="Import pages as JSON" placement="left" hasArrow>
                <label>
                  <input
                    id="saved-pages-import-input"
                    type="file"
                    aria-label={"Input for importing saved pages as JSON"}
                    onChange={handleImportData}
                    style={{ display: "none" }}
                  ></input>
                  <IconButton
                    as="span"
                    aria-label={"Import pages as JSON"}
                    variant="ghost"
                    icon={<HiOutlineUpload></HiOutlineUpload>}
                  ></IconButton>
                </label>
              </Tooltip>
              <Tooltip label="Delete all saved pages" placement="left" hasArrow>
                <IconButton
                  aria-label={"Delete all saved pages"}
                  variant="ghost"
                  textColor="orangered"
                  onClick={props.deleteAllSavedPages}
                  icon={<HiOutlineTrash></HiOutlineTrash>}
                ></IconButton>
              </Tooltip>
            </VStack>
          </Box>
        </PopoverContent>
      </Popover>
    </>
  );
}