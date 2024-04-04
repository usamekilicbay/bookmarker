import { Flex, Link } from "@chakra-ui/react";
import { LiaGithub, LiaLinkedin } from "react-icons/lia";

export default function Links() {
  return (
    <>
      <Flex textColor="orange">
        <Link
          href="https://www.linkedin.com/in/usame-kilicbay/"
          isExternal
          _hover={{
            textColor: "purple.500",
            transform: "scale(1.5)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <LiaLinkedin className="size-6"></LiaLinkedin>
        </Link>
        <Link
          href="https://www.linkedin.com/in/usame-kilicbay/"
          isExternal
          _hover={{
            textColor: "purple.500",
            transform: "scale(1.5)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <LiaGithub className="size-6"></LiaGithub>
        </Link>
      </Flex>
    </>
  );
}
