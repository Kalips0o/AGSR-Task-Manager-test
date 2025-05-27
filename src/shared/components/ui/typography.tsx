import type { CSSProperties, ReactNode } from "react";

import { twMerge } from "tailwind-merge";

export type TypographyVariant =
  | "headline-3-semibold"
  | "headline-3-medium"
  | "headline-1"
  | "headline-2-bold"
  | "btn-semibold"
  | "body-lg-regular"
  | "body-lg-bold"
  | "body-m-bold"
  | "body-m-semibold"
  | "body-m-medium"
  | "body-m-regular"
  | "sm-regular"
  | "sm-semibold"
  | "sm-medium";

type TextDecoration = "underline" | "stroke" | "italic";

export type TypographyTag = "h1" | "h2" | "h3" | "h4" | "span" | "div" | "p";

interface TypographyProps<T extends TypographyTag> {
  variant?: TypographyVariant;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  strong?: boolean;
  td?: TextDecoration;
  tag?: T;
  onClick?: () => void;
}

const classes = {
  "headline-3-semibold": "text-[16px] leading-[19px] font-[600]",
  "headline-3-medium": "text-[16px] leading-[19px] font-[500]",
  "headline-1": "text-[26px] leading-[31px] font-[700]",
  "headline-2-bold": "text-[18px] leading-[22px] font-[700]",
  "btn-semibold": "text-[14px] leading-[17px] font-[600]",
  "body-lg-regular": "text-[14px] leading-[18px] font-[400]",
  "body-lg-bold": "text-[14px] leading-[18px] font-[700]",
  "body-m-bold": "text-[12px] leading-[15px] font-[700]",
  "body-m-semibold": "text-[12px] leading-[16px] font-[600]",
  "body-m-medium": "text-[12px] leading-[16px] font-[500]",
  "body-m-regular": "text-[12px] leading-[14px] font-[400]",
  "sm-regular": "text-[10px] leading-[15px] font-[600]",
  "sm-semibold": "text-[10px] leading-[12px] font-[500]",
  "sm-medium": "text-[10px] leading-[12px] font-[400]",
};

export const Typography = <T extends TypographyTag>({
  children,
  className,
  style,
  td,
  strong,
  tag: Tag,
  variant = "body-lg-regular",
  onClick,
}: TypographyProps<T>) => {
  const TagToRender = Tag || "p";

  return (
    <TagToRender
      className={twMerge(`${classes[variant]}`, strong && "strong", td && `${td}`, className)}
      style={style}
      onClick={onClick}
    >
      {children}
    </TagToRender>
  );
};
