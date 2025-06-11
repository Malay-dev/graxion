import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { XLogo } from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const TeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQHQaFN6z8_WnQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1663607880574?e=1755129600&v=beta&t=iMRpNQJvJ-r_DXBZvpdA1CGO_SBrxXxuyAulWPGz6FQ",
      firstName: "Malay",
      lastName: "Kumar",
      positions: ["Developer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/malayk/",
        },
        {
          name: "Github",
          url: "https://github.com/Malay-dev",
        },
        {
          name: "X",
          url: "https://x.com/leo_mirand4",
        },
      ],
    },
    {
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQEUduVsUyTGsA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722496616019?e=1755129600&v=beta&t=rvn8LTNg6Ai4YHglB2pKB8ih6fAQqjFL6t_N_rotlw4",
      firstName: "Ashiq",
      lastName: "Noor Sudheer",
      positions: ["Developer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/ashiq-noor-sudheer/",
        },
        {
          name: "Github",
          url: "https://github.com/AshiqNoor-S",
        },
      ],
    },
    {
      imageUrl:
        "https://media.licdn.com/dms/image/v2/D5603AQHAJ5PbLpxayQ/profile-displayphoto-shrink_200_200/B56ZRzGD1wGsAg-/0/1737097756843?e=1755129600&v=beta&t=EL8vrnlDL_ytkqDVM5LEc9gkGlyTDddxxNN22U1l0uk",
      firstName: "Mathew",
      lastName: "Thomas Modisseril",
      positions: ["AI Engineer"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/mathewmodisseril/",
        },
        {
          name: "Github",
          url: "https://github.com/Mat-Algo",
        },
      ],
    },
  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedinLogo size={32} />;
      case "Github":
        return <GithubLogo size={32} />;
      case "X":
        return <XLogo size={32} />;
    }
  };

  return (
    <section id="team" className="container lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Team
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          The Dream Team
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {teamList.map(
          (
            { imageUrl, firstName, lastName, positions, socialNetworks },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg">
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden ">
                  <Image
                    src={imageUrl}
                    alt=""
                    width={300}
                    height={300}
                    className="w-full aspect-square  object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-2 px-6">
                  {firstName}
                  <span className="text-primary ml-2">{lastName}</span>
                </CardTitle>
              </CardHeader>
              {positions.map((position, index) => (
                <CardContent
                  key={index}
                  className={`pb-0 text-muted-foreground ${
                    index === positions.length - 1 && "pb-0"
                  }`}>
                  {position}
                  {index < positions.length - 1 && <span>,</span>}
                </CardContent>
              ))}

              <CardFooter className="space-x-4 mt-auto">
                {socialNetworks.map(({ name, url }, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    className="hover:opacity-80 transition-all">
                    {socialIcon(name)}
                  </Link>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
