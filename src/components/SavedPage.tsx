import { ISavedPage } from "../models/saved-page";
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineCheck,
  HiOutlinePencilAlt,
  HiOutlineTrash,
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
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function SavedPage(props: {
  incomingPage: ISavedPage;
  deletePage: () => void;
  editPage: (editedReminderText: string) => void;
  isAutoDelete: boolean;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useBoolean(false);
  const toast = useToast();

  const dateObject = new Date(props.incomingPage.saveDate);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleOnChangeReminderText = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    props.incomingPage.reminderText = e.target.value;
    console.log(props.incomingPage.reminderText);
  };

  const handleOnFinishEditingReminderText = () => {
    setIsEditing(false);
    props.editPage(props.incomingPage.reminderText);
    toast({
      title: "Reminder text updated successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleLinkOnClick = () => {
    window.open(props.incomingPage.url, "_blank");
    if (props.isAutoDelete) {
      props.deletePage();
    }
  };

  return (
    <>
      <ListItem>
        <Box
          borderRadius="sm"
          bg="orange.50"
          outline="solid 1px"
          outlineColor="orange.500"
          my={isDetailsExpanded ? "10px" : undefined}
          _hover={{
            transform: "scale(1.1)",
            bg: "orange.100",
          }}
          transition="transform 0.2s ease-in-out"
        >
          {isEditing ? (
            <HStack spacing={1}>
              <Box flexGrow={1}>
                <Editable
                  defaultValue={props.incomingPage.reminderText}
                  textAlign="start"
                  p={1}
                  pe={0}
                  startWithEditView
                  onSubmit={handleOnFinishEditingReminderText}
                >
                  <EditablePreview />
                  <EditableInput onChange={handleOnChangeReminderText} />
                </Editable>
              </Box>
              <Divider
                h="2em"
                orientation="vertical"
                borderColor="orange.500"
              />
              <Box>
                <Tooltip label="Save" hasArrow>
                  <IconButton
                    aria-label="Save changes"
                    variant="ghost"
                    icon={<HiOutlineCheck></HiOutlineCheck>}
                    onClick={handleOnFinishEditingReminderText}
                  />
                </Tooltip>
              </Box>
            </HStack>
          ) : (
            <>
              <HStack spacing={0}>
                <Box
                  as="a"
                  flexGrow={1}
                  borderRadius="sm"
                  padding={1}
                  textAlign="start"
                  textColor="black.alpha.50"
                  onClick={handleLinkOnClick}
                >
                  <Link isTruncated>{props.incomingPage.reminderText}</Link>
                </Box>
                <Divider
                  h="1em"
                  orientation="vertical"
                  borderColor="orange.500"
                />
                <Box ms={1}>
                  <Tooltip label="Details" hasArrow>
                    <IconButton
                      aria-label="Show details"
                      variant="ghost"
                      size="sm"
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
                  borderColor="orange.500"
                  mb={2}
                ></Divider>
                <Text align="start" fontSize="x-small">
                  {formattedDate}
                </Text>
                <Text fontSize="small">{props.incomingPage.title}</Text>
                <Text align="start">{props.incomingPage.reminderText}</Text>
              </Box>
            </>
          )}
        </Box>
      </ListItem>
    </>
  );
}
