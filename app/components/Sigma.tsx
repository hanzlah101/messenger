import { FC } from "react";
import Image from "next/image";
import { BsPlayFill } from "react-icons/bs";
import Link from "next/link";

interface SigmaProps {
  url: string;
  play?: boolean;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

const Sigma: FC<SigmaProps> = ({ url, play, alt, onClick, className }) => {
  const getFileType = (fileUrl: string | any) => {
    const extension = fileUrl?.split(".")?.pop().toLowerCase();
    if (extension.match(/(jpg|jpeg|png|gif)$/)) {
      return "image";
    } else if (extension.match(/(mp4|avi|wmv|mov)$/)) {
      return "video";
    } else if (extension.match(/(pdf)$/)) {
      return "pdf";
    } else if (extension.match(/(txt|csv|doc|docx)$/)) {
      return "text";
    }
    return "unknown";
  };

  const fileType = getFileType(url);

  switch (fileType) {
    case "image":
      return (
        <Image
          src={url}
          alt={alt || "image_not_working"}
          fill
          className={className}
          onClick={onClick}
        />
      );
    case "video":
      return (
        <div
          onClick={onClick}
          className="relative flex items-center justify-center w-full h-full"
        >
          <video
            src={url}
            controls={play}
            autoPlay={play}
            loop={play}
            className={className}
          >
            Your browser does not support the video tag.
          </video>

          {!play && (
            <span className="absolute cursor-pointer p-2 rounded-full flex items-center justify-center bg-gray-500/90">
              <BsPlayFill size={32} />
            </span>
          )}
        </div>
      );
    case "pdf":
      return (
        <div className="w-full h-full cursor-pointer relative">
          <embed src={url} type="application/pdf" className={`${className}`} />

          <Link
            href={url}
            target="_blank"
            className="z-30 cursor-pointer w-full h-full absolute top-0 left-0"
          />
        </div>
      );
    case "text":
      return (
        <div
          className="w-full h-[320px] bg-white border relative cursor-pointer"
          onClick={onClick}
        >
          <iframe src={url} className={className} />
          {!play && (
            <div className="absolute top-0 left-0 w-full h-full cursor-pointer" />
          )}
        </div>
      );
    default:
      return (
        <Link href={url} target="_blank">
          Unsupported file format
        </Link>
      );
  }
};

export default Sigma;
