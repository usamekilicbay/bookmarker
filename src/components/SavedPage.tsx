import { SavedPageModel } from "../models/saved-page";
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
  EditablePreview,
  EditableTextarea,
  Flex,
  IconButton,
  Link,
  ListItem,
  // Popover,
  // PopoverArrow,
  // PopoverBody,
  // PopoverCloseButton,
  // PopoverContent,
  // PopoverHeader,
  // PopoverTrigger,
  // Portal,
  Text,
  Tooltip,
  useBoolean,
  useToast,
} from "@chakra-ui/react";

export default function SavedPage(props: {
  incomingPage: SavedPageModel;
  deletePage: () => void;
  editPage: (editedReminderText: string) => void;
}) {
  const [editModeToggle, setEditModeToggle] = useBoolean(false);
  const [showDetails, setShowDetails] = useBoolean(false);
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.incomingPage.reminderText = e.target.value;
  };

  const onFinishEditing = () => {
    setEditModeToggle.off;
    props.editPage(props.incomingPage.reminderText);

    toast({
      title: "Page edited successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <ListItem>
        <Box
          borderRadius="sm"
          bg="orange.50"
          outline="solid 1px"
          outlineColor="orange.500"
          my={showDetails ? "10px" : undefined}
          _hover={{
            transform: "scale(1.1)",
            bg: "orange.100",
          }}
          transition="transform 0.2s ease-in-out"
        >
          <Flex align="center">
            {editModeToggle ? (
              <>
                <Editable
                  defaultValue={props.incomingPage.reminderText}
                  textAlign="start"
                  padding={3}
                >
                  <EditablePreview />
                  <EditableTextarea onChange={() => onChange} />
                </Editable>
                <Divider
                  h="5em"
                  orientation="vertical"
                  borderColor="orange.500"
                />
              </>
            ) : (
              <>
                <Box
                  flexGrow={1}
                  isTruncated
                  borderRadius="sm"
                  padding={1}
                  textAlign="start"
                  textColor="black.alpha.50"
                >
                  <Link href={props.incomingPage.url} isExternal>
                    {props.incomingPage.reminderText}
                  </Link>
                </Box>
                <Divider
                  h="1em"
                  orientation="vertical"
                  borderColor="orange.500"
                />
              </>
            )}
            <Box ms={1}>
              <Flex>
                {editModeToggle ? (
                  <Tooltip label="Save" hasArrow>
                    <IconButton
                      aria-label="Save changes"
                      variant="ghost"
                      size="sm"
                      icon={<HiOutlineCheck></HiOutlineCheck>}
                      onClick={() => onFinishEditing()}
                    />
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip label="Details" hasArrow>
                      <IconButton
                        aria-label="Show details"
                        variant="ghost"
                        size="sm"
                        onClick={setShowDetails.toggle}
                        icon={
                          showDetails ? (
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
                        onClick={setEditModeToggle.on}
                      />
                    </Tooltip>
                    {/* <Popover>
                      <Tooltip label="Details" hasArrow>
                        <Box>
                          <PopoverTrigger>
                            <IconButton
                              aria-label="Show details"
                              variant="ghost"
                              size="sm"
                              icon={
                                <HiOutlineMagnifyingGlass></HiOutlineMagnifyingGlass>
                              }
                            />
                          </PopoverTrigger>
                        </Box>
                      </Tooltip>
                      <Portal>
                        <PopoverContent w="200px">
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>
                            <Text fontSize="xs">{formattedDate}</Text>
                            <Text align="center">
                              {props.incomingPage.title}
                            </Text>
                          </PopoverHeader>
                          <PopoverBody>
                            <Text align="start">
                              {props.incomingPage.reminderText}
                            </Text>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                            */}
                  </>
                )}
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
              </Flex>
            </Box>
          </Flex>
          {showDetails && (
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
