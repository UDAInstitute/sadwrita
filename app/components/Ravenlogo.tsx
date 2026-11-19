import Image from "next/image";

type RavenLogoProps = {
  className?: string;
};

export default function RavenLogo({ className = "" }: RavenLogoProps) {
  return (
    <Image
      src="/images/Raven.png"
      alt="Sadwrita raven"
      width={1254}
      height={1254}
      priority
      className={className}
    />
  );
}