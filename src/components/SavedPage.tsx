import { ISavedPage } from "../models/saved-page";
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineCheck,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";
import {
  Box,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  Link,
  ListItem,
  Text,
  Tooltip,
  VStack,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSettingsContext } from "../contexts/settings-context";

export default function SavedPage(props: {
  incomingPage: ISavedPage;
  deletePage: () => void;
  updatePage: (editedReminderText: string) => void;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useBoolean(false);
  const toast = useToast();
  const [editedReminderText, setEditedReminderText] = useState<string>(
    props.incomingPage.reminderText
  );
  const isAutoDelete = useSettingsContext().autoDelete;

  const dateObject = new Date(props.incomingPage.saveDate);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);

  const handleCtrlKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Control") {
      setIsCtrlPressed(true);
    }
  };
  const keyDownRef = useRef(handleCtrlKeyDown);

  const handleCtrlKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Control") {
      setIsCtrlPressed(false);
    }
  };
  const keyUpRef = useRef(handleCtrlKeyUp);

  useEffect(() => {
    document.addEventListener("keydown", keyDownRef.current);
    document.addEventListener("keyup", keyUpRef.current);

    return () => {
      document.removeEventListener("keydown", keyDownRef.current);
      document.removeEventListener("keyup", keyUpRef.current);
    };
  }, []);

  const handleOnKeyDownReminderTextEditInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      handleOnFinishEditingReminderText();
    } else if (e.key === "Escape") {
      handleOnCancelEditingReminderText();
    }
  };

  const handleOnChangeReminderText = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEditedReminderText(e.target.value);
  };

  const handleOnCancelEditingReminderText = () => {
    setIsEditing(false);
    setEditedReminderText(props.incomingPage.reminderText);
  };

  const handleOnFinishEditingReminderText = () => {
    console.log(props.incomingPage.reminderText);
    if (editedReminderText === props.incomingPage.reminderText) {
      setEditedReminderText(props.incomingPage.reminderText);
      toast({
        title: "Reminder text not changed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsEditing(false);
    updatePage();
  };

  const handleOnClickLink = () => {
    window.open(props.incomingPage.url, "_blank");
    if (isAutoDelete || isCtrlPressed) {
      props.deletePage();
    }
  };

  const updatePage = () => {
    props.updatePage(editedReminderText);
    toast({
      title: "Reminder text updated successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <ListItem>
        <Box
          bg="dark.item_bg"
          borderRadius="sm"
          outline="dashed 1px"
          outlineColor="dark.outline"
          my={isDetailsExpanded ? "10px" : undefined}
          _hover={{
            transform: "scale(1.1)",
          }}
          transition="transform 0.2s ease-in-out"
        >
          {isEditing ? (
            <HStack spacing={1}>
              <Box flexGrow={1}>
                <Editable
                  defaultValue={editedReminderText}
                  textAlign="start"
                  p={1}
                  pe={0}
                  startWithEditView
                  onKeyDown={handleOnKeyDownReminderTextEditInput}
                >
                  <EditablePreview />
                  <EditableInput onChange={handleOnChangeReminderText} />
                </Editable>
              </Box>
              <Divider
                h="2em"
                orientation="vertical"
                borderColor="dark.outline"
              />
              <VStack spacing={0.3}>
                <Tooltip label="Save" hasArrow>
                  <IconButton
                    aria-label="Save changes"
                    variant="ghost"
                    size="sm"
                    icon={<HiOutlineCheck></HiOutlineCheck>}
                    onClick={handleOnFinishEditingReminderText}
                  />
                </Tooltip>
                <Tooltip label="Cancel" hasArrow>
                  <IconButton
                    aria-label="Cancel changes"
                    variant="ghost"
                    size="sm"
                    icon={<HiOutlineX></HiOutlineX>}
                    onClick={handleOnCancelEditingReminderText}
                  />
                </Tooltip>
              </VStack>
            </HStack>
          ) : (
            <>
              <HStack spacing={0}>
                <Box
                  flexGrow={1}
                  maxW="70%"
                  borderRadius="sm"
                  padding={1}
                  textAlign="start"
                  onClick={handleOnClickLink}
                >
                  <Link>
                    <Text isTruncated>{props.incomingPage.reminderText}</Text>
                  </Link>
                </Box>
                <Divider
                  h="1em"
                  orientation="vertical"
                  borderColor="dark.outline"
                />
                <Box ms={1}>
                  <Tooltip label="Details" hasArrow>
                    <IconButton
                      aria-label="Show details"
                      variant="ghost"
                      size="sm"
                      color="dark.text.primary"
                      onClick={setIsDetailsExpanded.toggle}
                      icon={
                        isDetailsExpanded ? (
                          <HiChevronUp></HiChevronUp>
                        ) : (
                          <HiChevronDown></HiChevronDown>
                        )
                      }
                    />
                  </Tooltip>
                  <Tooltip label="Edit" hasArrow>
                    <IconButton
                      aria-label="Edit saved page"
                      variant="ghost"
                      size="sm"
                      color="dark.text.primary"
                      icon={<HiOutlinePencilAlt></HiOutlinePencilAlt>}
                      onClick={() => setIsEditing(true)}
                    />
                  </Tooltip>
                  <Tooltip label="Delete" hasArrow>
                    <IconButton
                      aria-label="Delete saved page"
                      variant="ghost"
                      size="sm"
                      textColor="orangered"
                      icon={<HiOutlineTrash></HiOutlineTrash>}
                      onClick={props.deletePage}
                    />
                  </Tooltip>
                </Box>
              </HStack>
            </>
          )}
          {isDetailsExpanded && (
            <>
              <Box p={2}>
                <Divider
                  w="80%"
                  mx="auto"
                  borderColor="dark.outline"
                  mb={3}
                ></Divider>
                <Text align="start" fontSize="x-small">
                  {formattedDate}
                </Text>
                <Text fontWeight="bold" my={1}>
                  {props.incomingPage.title}
                </Text>
                <Text textAlign="start" align="start" fontSize="large">
                  {props.incomingPage.reminderText}
                </Text>
              </Box>
            </>
          )}
        </Box>
      </ListItem>
    </>
  );
}
