import { useEffect, useState } from "react";
import { ISavedPage } from "../models/saved-page";
import { Box, Flex, IconButton, Input, useToast } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";
import { REMINDER_TEXT_MIN_LENGTH } from "../common/constants";

export default function SavePageTextBox(props: {
  isActive: boolean;
  setPage: (page: ISavedPage) => void;
}) {
  const [reminderText, setReminderText] = useState<string>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    if (reminderText) {
      setIsValid(reminderText.length >= REMINDER_TEXT_MIN_LENGTH);
    } else {
      setIsValid(false);
    }
  }, [reminderText]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminderText(e.target.value);
  };

  const handleOnKeyDownReminderTextSaveInput = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.key === "Enter") {
      await savePage();
    }
  };

  const onClickSave = async () => {
    await savePage();
  };

  const savePage = async () => {
    if (!reminderText) {
      toast({
        title: "Page could not be saved",
        description: "You must enter a text as reminder first.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const url = tab.url;
    const title = tab.title;
    if (url && title && reminderText) {
      props.setPage({
        id: crypto.randomUUID(),
        url: url,
        title: title,
        reminderText: reminderText,
        saveDate: new Date(),
      });

      setReminderText("");
    }
  };

  return (
    <>
      <Box id="save_text_box" marginY={5}>
        <Flex>
          {props.isActive && (
            <Input
              id="save_page_input"
              isInvalid={isValid}
              variant="flushed"
              placeholder="Enter something to remember"
              focusBorderColor="dark.focused"
              errorBorderColor="dark.error"
              onChange={onChange}
              onKeyDown={handleOnKeyDownReminderTextSaveInput}
              boxShadow="lg"
              paddingX={2}
              autoFocus
              value={reminderText}
            />
          )}
          <IconButton
            aria-label={"Save page"}
            variant="ghost"
            icon={<HiPlus></HiPlus>}
            fontSize="x-large"
            textColor={
              isValid || props.isActive ? "dark.enabled" : "dark.disabled"
            }
            onClick={onClickSave}
            transform={
              isValid || props.isActive ? "rotate(0Deg)" : "rotate(-45Deg)"
            }
            _hover={{
              transform: "scale(1.5)",
              transition: "transform 0.3s ease-in-out",
            }}
          ></IconButton>
        </Flex>
      </Box>
    </>
  );
}
