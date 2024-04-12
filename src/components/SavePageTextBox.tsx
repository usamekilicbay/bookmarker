import { useEffect, useState } from "react";
import { ISavedPage } from "../models/saved-page";
import { Box, Flex, IconButton, Input, useToast } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";
import { REMINDER_TEXT_MIN_LENGTH } from "../common/constants";

export default function SavePageTextBox(props: {
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

  const onClickSave = async () => {
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
    }
  };

  return (
    <>
      <Box id="save_text_box" marginY={5}>
        <Flex>
          <Input
            isInvalid={isValid}
            variant="flushed"
            placeholder="Enter something to remember"
            focusBorderColor="purple.500"
            errorBorderColor="crimson"
            onChange={onChange}
            boxShadow="lg"
            paddingX={2}
            autoFocus
          />
          <IconButton
            aria-label={"Save page"}
            variant="ghost"
            icon={<HiPlus></HiPlus>}
            fontSize="x-large"
            textColor={isValid ? "purple.500" : "orangered"}
            onClick={onClickSave}
            transform={isValid ? "rotate(0Deg)" : "rotate(-45Deg)"}
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
