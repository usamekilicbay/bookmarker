import {
  Box,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
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
import { ISavedPage as ISavedPage } from "../models/saved-page";
import saveAs from "file-saver";
import {
  PAGE_SAVE_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
} from "../common/constants";
import { useEffect, useState } from "react";

export default function Settings(props: {
  deleteAllSavedPages: () => void;
  loadSavedPages: (storageKey: string) => void;
  importPages: (file: File) => void;
  getSavedPage: (id: string) => ISavedPage | undefined;
  savedPages: ISavedPage[];
  setIsAutoDelete: (autoDelete: boolean) => void;
}) {
  const [settings, setSettings] = useState<ISettings>();
  const [isAutoDeleteChecked, setIsAutoDeleteChecked] =
    useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const tempSettings = loadSettings();
    setSettings(tempSettings);
    setIsAutoDeleteChecked(tempSettings.autoDelete);
  }, []);

  useEffect(() => {
    if (!settings) return;
    setIsAutoDeleteChecked(settings.autoDelete);
    if (settings === loadSettings()) return;
    saveSettings();
  }, [settings]);

  function loadSettings(): ISettings {
    const value = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (value) {
      const tempSettings = JSON.parse(value) as ISettings;

      return tempSettings;
    }

    return {} as ISettings;
  }

  function saveSettings(): void {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  const handleOnChangeAutoDelete = (): void => {
    setSettings({
      ...settings,
      autoDelete: !isAutoDeleteChecked,
    });

    props.setIsAutoDelete(isAutoDeleteChecked);
  };

  const handleExportData = () => {
    const jsonData = JSON.stringify(props.savedPages, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "bookmarker-saved-pages.json");
    toast({
      title: "Data exported successfully",
      description: "You can download it now",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement & { files: FileList };
    const file = target.files[0];

    if (file && file.type === "application/json") {
      props.importPages(file);
    } else {
      toast({
        title: "Data import failed",
        description: "Imported file is in wrong format",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    toast({
      title: "Data imported successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleOnLoadSavedPages = () => {
    props.loadSavedPages(PAGE_SAVE_STORAGE_KEY);
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
              <Tooltip
                label={`Auto delete (${
                  isAutoDeleteChecked ? "active" : "disabled"
                }) saved page after opening`}
                placement="left"
                hasArrow
              >
                <Box mt={2}>
                  <Switch
                    aria-label="Toggle auto delete"
                    variant="ghost"
                    size="sm"
                    isChecked={isAutoDeleteChecked}
                    onChange={handleOnChangeAutoDelete}
                  ></Switch>
                </Box>
              </Tooltip>
              <Tooltip label="Reload saved pages" placement="left" hasArrow>
                <IconButton
                  aria-label="Reload saved pages"
                  variant="ghost"
                  onClick={handleOnLoadSavedPages}
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
