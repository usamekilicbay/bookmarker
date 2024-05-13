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
  HiOutlineSparkles,
} from "react-icons/hi";
import { HiMagnifyingGlass, HiOutlineArrowPath } from "react-icons/hi2";
import { ISavedPage as ISavedPage } from "../models/saved-page";
import saveAs from "file-saver";
import { PAGE_SAVE_STORAGE_KEY } from "../common/constants";
import { IS_DEV_MODE_ACTIVE } from "../common/dev-constants";
import { useEffect, useState } from "react";
import {
  SettingsContext,
  useSettingsContext,
} from "../contexts/settings-context";

export default function Settings(props: {
  setSettings: (settings: ISettings) => void;
  deleteAllSavedPages: () => void;
  loadSavedPages: (storageKey: string) => void;
  importPages: (file: File) => void;
  getSavedPage: (id: string) => ISavedPage | undefined;
  seedDummyPages: () => void;
  removeDummyPages: () => void;
  savedPages: ISavedPage[];
}) {
  const settings = useSettingsContext();
  const [isAutoDeleteChecked, setIsAutoDeleteChecked] =
    useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    setIsAutoDeleteChecked(settings.autoDelete);
  }, [settings]);

  const handleOnChangeAutoDelete = (): void => {
    const currentIsAutoDeleteChecked = !isAutoDeleteChecked;
    props.setSettings({
      ...settings,
      autoDelete: currentIsAutoDeleteChecked,
    });
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

  function handleImportData(event: React.ChangeEvent<HTMLInputElement>): void {
    const target = event.target as HTMLInputElement & { files: FileList };
    const file = target.files[0];
    if (file && file.type === "application/json") {
      props.importPages(file);

      toast({
        title: "Data imported successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      return;
    }
    toast({
      title: "Data import failed",
      description: "Imported file is in wrong format",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  const handleOnLoadSavedPages = (): void => {
    props.loadSavedPages(PAGE_SAVE_STORAGE_KEY);
  };

  return (
    <>
      <SettingsContext.Provider value={settings}>
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
                <Tooltip
                  label="Delete all saved pages"
                  placement="left"
                  hasArrow
                >
                  <IconButton
                    aria-label={"Delete all saved pages"}
                    variant="ghost"
                    textColor="orangered"
                    onClick={props.deleteAllSavedPages}
                    icon={<HiOutlineTrash></HiOutlineTrash>}
                  ></IconButton>
                </Tooltip>
                {IS_DEV_MODE_ACTIVE && (
                  <>
                    <Tooltip
                      label="Generate dummy pages"
                      placement="left"
                      hasArrow
                    >
                      <IconButton
                        aria-label={"Generate dummy pages"}
                        variant="ghost"
                        textColor="purple"
                        onClick={props.seedDummyPages}
                        icon={<HiOutlineSparkles></HiOutlineSparkles>}
                      ></IconButton>
                    </Tooltip>
                    <Tooltip
                      label="Remove dummy pages"
                      placement="left"
                      hasArrow
                    >
                      <IconButton
                        aria-label={"Remove dummy pages"}
                        variant="ghost"
                        textColor="purple"
                        onClick={props.removeDummyPages}
                        icon={<HiOutlineTrash></HiOutlineTrash>}
                      ></IconButton>
                    </Tooltip>
                  </>
                )}
              </VStack>
            </Box>
          </PopoverContent>
        </Popover>
      </SettingsContext.Provider>
    </>
  );
}
